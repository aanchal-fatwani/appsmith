import React from "react";
import styled from "styled-components";
import { Setting, SettingTypes } from "../SettingsConfig";
import { StyledLabel } from "./Common";
import Link from "./Link";
import TextInput from "./TextInput";
import Toggle from "./Toggle";
import Text from "./Text";
import Button from "./Button";

type GroupProps = {
  name?: string;
  settings?: Setting[];
};

const GroupWrapper = styled.div``;

const GroupHeader = styled(StyledLabel)`
  text-transform: capitalize;
  margin-bottom: ${(props) => props.theme.spaces[9]}px;
`;

const GroupBody = styled.div``;

export default function Group({ name, settings }: GroupProps) {
  return (
    <GroupWrapper>
      <GroupHeader>{name}</GroupHeader>
      <GroupBody>
        {settings &&
          settings.map((setting) => {
            switch (setting.controlType) {
              case SettingTypes.TEXTINPUT:
                return <TextInput key={setting.name} setting={setting} />;
              case SettingTypes.TOGGLE:
                return <Toggle key={setting.name} setting={setting} />;
              case SettingTypes.LINK:
                return <Link key={setting.name} setting={setting} />;
              case SettingTypes.TEXT:
                return <Text key={setting.name} setting={setting} />;
              case SettingTypes.BUTTON:
                return <Button key={setting.name} setting={setting} />;
              case SettingTypes.GROUP:
                return (
                  <Group name={setting.name} settings={setting.children} />
                );
            }
          })}
      </GroupBody>
    </GroupWrapper>
  );
}
