import { createMessage } from "constants/messages";
import React from "react";
import {
  Field,
  WrappedFieldInputProps,
  WrappedFieldMetaProps,
} from "redux-form";
import styled from "styled-components";
import { FormGroup, SettingComponentProps } from "./Common";
import { FormTextFieldProps } from "components/ads/formFields/TextField";
import Toggle from "components/ads/Toggle";

const ToggleWrapper = styled.div``;

const ToggleStatus = styled.span`
  position: relative;
  top: -5px;
  left: 68px;
`;

function FieldToggle(
  ComponentProps: FormTextFieldProps & {
    meta: Partial<WrappedFieldMetaProps>;
    input: Partial<WrappedFieldInputProps>;
  },
) {
  function onToggle(value?: boolean) {
    ComponentProps.input.onChange && ComponentProps.input.onChange(value);
    ComponentProps.input.onBlur && ComponentProps.input.onBlur(value);
  }
  return (
    <ToggleWrapper>
      <Toggle onToggle={onToggle} value={ComponentProps.input.value} />
      <ToggleStatus>
        {ComponentProps.input.value ? "Enabled" : "Disabled"}
      </ToggleStatus>
    </ToggleWrapper>
  );
}

const StyledFieldToggleGroup = styled.div`
  margin-bottom: 32px;

  & .slider {
    margin-top: 10px;
  }
`;

export default function ToggleComponent({ setting }: SettingComponentProps) {
  return (
    <StyledFieldToggleGroup>
      <FormGroup label={createMessage(() => setting.label)}>
        <Field component={FieldToggle} name={setting.name} />
      </FormGroup>
    </StyledFieldToggleGroup>
  );
}
