import Text, { TextType } from "components/ads/Text";
import React from "react";
import styled from "styled-components";
import { FormGroup, SettingComponentProps } from "./Common";

const TextWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spaces[12]}px;
`;

const StyledText = styled(Text)`
  color: ${(props) => props.theme.colors.settings.link};
`;

export default function Link({ setting }: SettingComponentProps) {
  return (
    <FormGroup label={setting.label}>
      <TextWrapper>
        <StyledText type={TextType.P1}>{setting.value}</StyledText>
      </TextWrapper>
    </FormGroup>
  );
}
