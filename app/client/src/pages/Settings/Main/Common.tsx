import Tooltip from "components/ads/Tooltip";
import { createMessage } from "constants/messages";
import React from "react";
import styled from "styled-components";
import Icon, { IconSize } from "components/ads/Icon";
import { getTypographyByKey } from "constants/DefaultTheme";
import { Setting } from "../SettingsConfig";

type FieldHelperProps = {
  helpText?: string;
  label: string;
  children: React.ReactNode;
};

const StyledIcon = styled(Icon)`
  width: 20px;
`;

export const StyledFormGroup = styled.div`
  width: 357px;
  margin-bottom: ${(props) => props.theme.spaces[3]}px;

  & span.bp3-popover-target {
    display: inline-block;
    background: ${(props) => props.theme.colors.menuItem.normalIcon};
    border-radius: ${(props) => props.theme.radii[2]}px;
    width: 14px;
    padding: 3px 3px;
    position: relative;
    top: -2px;
    left: 6px;
    cursor: default;
  }
  & svg:hover {
    cursor: default;
    path {
      fill: #fff;
    }
  }
`;

export const StyledLabel = styled.label`
  margin-bottom: ${(props) => props.theme.spaces[3]}px;
  display: inline-block;
  ${(props) => getTypographyByKey(props, "h5")}
  color: ${(props) => props.theme.colors.textInput.normal.text};
`;

export function FormGroup({ children, helpText, label }: FieldHelperProps) {
  return (
    <StyledFormGroup>
      <StyledLabel>{label}</StyledLabel>
      {helpText && (
        <Tooltip content={createMessage(() => helpText)}>
          <StyledIcon fillColor="#fff" name="help" size={IconSize.XXS} />
        </Tooltip>
      )}
      {children}
    </StyledFormGroup>
  );
}

export type SettingComponentProps = {
  setting: Setting;
};
