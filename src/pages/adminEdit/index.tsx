import Header from "../../component/header";
import ContentLayout from "../../layout/contentLayout";
import Card from "../../component/card";
import Calendar from "../../component/calendar";
import Button from "../../component/button";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes.ts";
import Typography from "../../component/typography";
import { useState } from "react";
import Checkbox from "../../component/checkbox";
import styled from "styled-components";
import TimeSelect from "../../component/timeSelect";
import {
  generateTimeSlots,
  handleDateSetTime,
} from "../../utils/generateTimeSlots.ts";
import { useDayCreateUpdate } from "../../hooks/useDayCreateUpdate.ts";
import { getServerFormatDate } from "../../utils/getServerFormatDate.ts";
import { useGetDaysPeriod } from "../../hooks/useGetDaysPeriod.ts";
import { getStartEndOfMonth } from "../../utils/getStartEndOfMonth.ts";
import { getAvailableDates } from "../../utils/getAvailableDates.ts";
import { DayInterface } from "../../config/types.ts";
import { addMinutes, format } from "date-fns";
import { classroomSize } from "../../config/consts.ts";
import { generateClassroomPlacename } from "../../utils/generateClassroomPlacename.ts";

const AdminEditPage = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState<Date>();

  const { data } = useGetDaysPeriod(getStartEndOfMonth(currentDate));

  const availableDates = getAvailableDates({
    dates: data as DayInterface[],
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formValues, setFormValues] = useState<{
    nonWorkingDay: boolean;
    timeFrom?: string;
    timeTo?: string;
  }>({
    nonWorkingDay: false,
    timeFrom: undefined,
    timeTo: undefined,
  });
  const [selectedMeta, setSelectedMeta] = useState<
    (DayInterface & { id: number }) | undefined
  >();

  const enabledButton =
    formValues.nonWorkingDay || (formValues.timeFrom && formValues.timeTo);

  const { dayCreateUpdateMutation } = useDayCreateUpdate();

  const onSave = async () => {
    try {
      if (selectedDate) {
        const slots = generateTimeSlots({
          from: formValues.timeFrom,
          to: formValues.timeTo,
        });
        const places = {} as any;
        Array(classroomSize)
          .fill(0)
          .map((_, i) => {
            let value = [] as any[];
            if (!formValues.nonWorkingDay) {
              value = slots.map((time) => {
                const meta = selectedMeta?.places?.[i];
                const available =
                  meta?.find((el) => el.time === time)?.available || true;
                return {
                  time,
                  available,
                };
              });
            }
            places[generateClassroomPlacename(i)] = value;
          });

        await dayCreateUpdateMutation.mutateAsync({
          id: selectedMeta?.id,
          data: {
            date: (selectedMeta?.id
              ? selectedMeta.date
              : getServerFormatDate(selectedDate)) as string,
            places,
          },
        });
        navigate(routes.admin.path);
      }
    } catch (e) {
      //
    }
  };

  return (
    <>
      <Header
        title={"Расписание работы"}
        onBack={() => navigate(routes.admin.path)}
      />
      <ContentLayout>
        <Card>
          <Typography fontSize={16} textAlign={"center"}>
            Выберите день для настройки особого расписания
          </Typography>
        </Card>
        <Card dark>
          <Calendar
            selectedDate={selectedDate}
            onSelect={(e) => {
              setSelectedDate(e);
              const meta = data?.find(
                (el: DayInterface) => el.date === getServerFormatDate(e),
              );
              if (meta) {
                const firstPlace = meta.places[generateClassroomPlacename(0)];
                if (firstPlace.length === 0) {
                  setFormValues({
                    nonWorkingDay: true,
                    timeFrom: undefined,
                    timeTo: undefined,
                  });
                } else {
                  const firstDay = firstPlace[0];
                  const lastDay = firstPlace[firstPlace.length - 1];
                  const lastDayDate = addMinutes(
                    handleDateSetTime(lastDay.time),
                    15,
                  );
                  setFormValues({
                    nonWorkingDay: firstPlace.length === 0,
                    timeFrom: firstDay.time,
                    timeTo: format(lastDayDate, "HH:mm"),
                  });
                }
                setSelectedMeta(meta);
              } else {
                setFormValues({
                  nonWorkingDay: false,
                  timeFrom: undefined,
                  timeTo: undefined,
                });
                setSelectedMeta(undefined);
              }
            }}
            setCurrentDate={setCurrentDate}
            availableDates={availableDates}
          />
        </Card>
        {selectedDate && (
          <>
            <Checkbox
              value={formValues.nonWorkingDay}
              onChange={(nonWorkingDay) =>
                setFormValues((state) => ({ ...state, nonWorkingDay }))
              }
              label={"Нерабочий день"}
            />
            {!formValues.nonWorkingDay && (
              <>
                <Row>
                  <TimeWrapper>
                    <Typography fontSize={16}>с</Typography>
                    <TimeSelect
                      value={formValues.timeFrom}
                      list={generateTimeSlots({ to: formValues.timeTo }).map(
                        (el) => ({
                          value: el,
                          label: el,
                        }),
                      )}
                      onChange={(timeFrom) =>
                        setFormValues((state) => ({ ...state, timeFrom }))
                      }
                    />
                  </TimeWrapper>
                  <TimeWrapper>
                    <Typography fontSize={16}>по</Typography>
                    <TimeSelect
                      value={formValues.timeTo}
                      list={generateTimeSlots({
                        from: formValues.timeFrom,
                        isToDateList: !!formValues.timeFrom,
                      })
                        .map((el) => ({
                          value: el,
                          label: el,
                        }))
                        .slice(formValues.timeFrom ? 1 : 0)}
                      onChange={(timeTo) =>
                        setFormValues((state) => ({ ...state, timeTo }))
                      }
                    />
                  </TimeWrapper>
                </Row>
              </>
            )}
          </>
        )}
      </ContentLayout>
      <Card borderRadius={"35px 35px 0 0"}>
        <Button
          title={"Сохранить"}
          onClick={onSave}
          disabled={!enabledButton}
        />
      </Card>
    </>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default AdminEditPage;
