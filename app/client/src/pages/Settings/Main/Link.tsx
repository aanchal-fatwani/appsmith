import React from "react";
import styled from "styled-components";
import { Setting } from "../SettingsConfig";
import { SettingComponentProps } from "./Common";

const LinkWrapper = styled.div`
  width: 357px;
  margin-bottom: ${(props) => props.theme.spaces[13]}px;
`;

const StyledLink = styled.a``;

export default function Link({ setting }: SettingComponentProps) {
  return (
    <LinkWrapper>
      <StyledLink href={setting.url} target="_blank">
        {setting.label}
      </StyledLink>
    </LinkWrapper>
  );
}
