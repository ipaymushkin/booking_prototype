import { PropsWithChildren } from "react";
import styled from "styled-components";

const ContentLayout = ({ children }: PropsWithChildren) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #252525;
  padding: 15px;
  width: 100%;
  height: calc(100% - 130px);
  overflow-y: auto;
  gap: 10px;
`;

export default ContentLayout;
