import { Icon } from "@blueprintjs/core";
import Text, { TextType } from "components/ads/Text";
import React from "react";
import styled from "styled-components";
import { Setting } from "../SettingsConfig";
import { FormGroup, SettingComponentProps } from "./Common";

const LinkWrapper = styled.div`
  width: 357px;
  margin-bottom: ${(props) => props.theme.spaces[13]}px;
  margin-top: 3px;
`;

const StyledLink = styled.a`
  &&,
  &:hover {
    color: ${(props) => props.theme.colors.settings.link};
    text-decoration: none;
  }
`;

const StyledText = styled(Text)`
  font-weight: 600;
  font-size: 11px;
`;

const StyledIcon = styled(Icon)`
  && {
    color: ${(props) => props.theme.colors.settings.link};
    transform: translate(2px, -1px);

    svg:hover path {
      fill: ${(props) => props.theme.colors.settings.link};
      cursor: pointer;
    }
  }
`;

export default function Link({ setting }: SettingComponentProps) {
  return (
    <FormGroup label={setting.label}>
      <LinkWrapper>
        <StyledLink href={setting.url} target="_blank">
          <StyledText type={TextType.P1}>READ MORE</StyledText>
          &nbsp;
          <StyledIcon icon="arrow-right" iconSize={11} />
        </StyledLink>
      </LinkWrapper>
    </FormGroup>
  );
}
