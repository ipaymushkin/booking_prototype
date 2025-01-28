import styled from "styled-components";
import { PropsWithChildren } from "react";

interface Props {
  borderRadius?: string;
  withBorder?: boolean;
  padding?: string;
  dark?: boolean;
}

const Card = ({
  borderRadius = "15px",
  children,
  withBorder = false,
  padding = "15px",
  dark = false,
}: PropsWithChildren<Props>) => {
  return (
    <Container>
      <Wrapper
        borderRadius={borderRadius}
        withBorder={withBorder}
        padding={padding}
        dark={dark}
      >
        {children}
      </Wrapper>
    </Container>
  );
};

const Wrapper = styled.div<
  Pick<Props, "borderRadius" | "withBorder" | "padding" | "dark">
>`
  border-radius: ${({ borderRadius }) => borderRadius};
  padding: ${({ padding }) => padding};
  box-shadow: 0 -1px 10px 0 #0c2a6a33;
  background: ${({ dark }) => (dark ? "#353535" : "#494949")};
  ${({ withBorder }) => {
    if (withBorder) {
      return { border: "1px solid #0C2A6A" };
    }
  }}
`;

const Container = styled.div`
  background: #252525;
`;

export default Card;
