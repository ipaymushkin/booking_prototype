import Header from "../../component/header";
import Card from "../../component/card";
import Button from "../../component/button";
import ContentLayout from "../../layout/contentLayout";
import Calendar from "../../component/calendar";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes.ts";
import { useState } from "react";
import { useGetDaysPeriod } from "../../hooks/useGetDaysPeriod.ts";
import { getStartEndOfMonth } from "../../utils/getStartEndOfMonth.ts";
import { getAvailableDates } from "../../utils/getAvailableDates.ts";
import { DayInterface } from "../../config/types.ts";
import { useGetDayDetails } from "../../hooks/useGetDayDetails.ts";
import styled from "styled-components";
import Typography from "../../component/typography";
import { getPluralLabel } from "../../utils/getPluralLabel.ts";
import { format } from "date-fns";
import LongArrow from "../../assets/icons/longArrow.tsx";

const AdminPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>();

  const { data } = useGetDaysPeriod(getStartEndOfMonth(currentDate));
  const { data: dataDetails } = useGetDayDetails({ date: new Date() });

  const availableDates = getAvailableDates({
    dates: data as DayInterface[],
  });

  let recordsCount = 0;
  if (dataDetails?.places) {
    Object.values(dataDetails?.places).forEach((slots) => {
      if (slots.some((slot) => !slot.available)) {
        recordsCount += 1;
      }
    });
  }

  return (
    <>
      <Header title={"График бронирования"} />
      <ContentLayout>
        <Card dark>
          <Calendar
            setCurrentDate={setCurrentDate}
            availableDates={availableDates}
          />
        </Card>
        {dataDetails && (
          <Card>
            <RecordsWrapper>
              <RecordsInfo>
                <Typography fontSize={16} fontWeight={600}>
                  Занято {recordsCount}{" "}
                  {getPluralLabel(recordsCount, ["место", "места", "мест"])}
                </Typography>
                <Typography fontSize={14}>
                  Сегодня, {format(new Date(), "dd.MM.yyyy")} г.
                </Typography>
              </RecordsInfo>
              {recordsCount ? (
                <Circle onClick={() => navigate(routes.adminRecordsToday.path)}>
                  <LongArrow color={"white"} rotate={180} />
                </Circle>
              ) : null}
            </RecordsWrapper>
          </Card>
        )}
      </ContentLayout>
      <Card borderRadius={"35px 35px 0 0"} dark>
        <Button
          title={"Редактировать"}
          onClick={() => navigate(routes.adminEdit.path)}
        />
      </Card>
    </>
  );
};

const RecordsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecordsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #113d9e;
  border-radius: 50%;
  cursor: pointer;
`;

export default AdminPage;
