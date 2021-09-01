import { Icon } from "@blueprintjs/core";
import { saveSettings } from "actions/settingsAction";
import Button, { Category } from "components/ads/Button";
import { SETTINGS_FORM_NAME } from "constants/forms";
import { createMessage } from "constants/messages";
import {
  APPLICATIONS_URL,
  SETTINGS_CATEGORY_DEFAULT_URL,
} from "constants/routes";
import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Redirect,
  RouteComponentProps,
  useParams,
  withRouter,
} from "react-router";
import { AppState } from "reducers";
import { formValueSelector, InjectedFormProps, reduxForm } from "redux-form";
import {
  getSettings,
  getSettingsSavingState,
} from "selectors/settingsSelectors";
import styled from "styled-components";
import history from "utils/history";
import Group from "./Main/group";
import { SettingsFactory } from "./SettingsConfig";

const Wrapper = styled.div`
  flex-basis: calc(100% - ${(props) => props.theme.homePage.leftPane.width}px);
  padding-left: ${(props) =>
    props.theme.homePage.leftPane.rightMargin +
    props.theme.homePage.leftPane.leftPadding}px;
  padding-top: 40px;
`;

const BackButton = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const BackButtonText = styled.span``;

const SettingsFormWrapper = styled.div`
  margin-top: 32px;
`;

const SettingsButtonWrapper = styled.div``;

const StyledButton = styled(Button)`
  height: 24px;
  display: inline-block;
  margin-right: 16px;
`;

const StyledSaveButton = styled(StyledButton)`
  width: 118px;
`;

const StyledClearButton = styled(StyledButton)`
  width: 68px;
`;

export const BottomSpace = styled.div`
  height: 20px;
`;

type MainProps = {
  settings: Record<string, string>;
};

function createSettingLabel(name = "") {
  return name.replace(/_/g, " ").toUpperCase();
}

function useSettings(config: Record<string, string>, category: string) {
  return SettingsFactory.get(config, category);
}

export function Main(
  props: InjectedFormProps & RouteComponentProps & MainProps,
) {
  const { category } = useParams() as any;
  const config = useSelector(getSettings);
  const settings = useSettings(config, category);
  const isSaving = useSelector(getSettingsSavingState);
  const dispatch = useDispatch();

  const onBack = () => {
    history.push(APPLICATIONS_URL);
  };
  const onSave = () => {
    dispatch(saveSettings(props.settings));
  };

  const onClear = () => {
    const initialValues: Record<string, string | boolean> = {};
    settings.forEach((setting) => {
      initialValues[setting.name] = setting.value;
    });
    props.initialize(initialValues);
  };

  useEffect(onClear, [category]);

  if (!SettingsFactory.categories.has(category)) {
    return <Redirect to={SETTINGS_CATEGORY_DEFAULT_URL} />;
  }

  return (
    <Wrapper>
      <BackButton onClick={onBack}>
        <Icon icon="chevron-left" iconSize={16} />
        <BackButtonText>&nbsp;Back</BackButtonText>
      </BackButton>
      <SettingsFormWrapper>
        <Group settings={settings} />
        <SettingsButtonWrapper>
          <StyledSaveButton
            category={Category.primary}
            disabled={Object.keys(props.settings).length == 0 || !props.valid}
            isLoading={isSaving}
            onClick={onSave}
            tag="button"
            text={createMessage(() => "Save changes")}
          />
          <StyledClearButton
            category={Category.tertiary}
            disabled={Object.keys(props.settings).length == 0}
            onClick={onClear}
            tag="button"
            text={createMessage(() => "Clear")}
          />
        </SettingsButtonWrapper>
        <BottomSpace />
      </SettingsFormWrapper>
    </Wrapper>
  );
}

const validate = (values: Record<string, any>) => {
  const errors: any = {};
  _.filter(values, (value, name) => {
    const message = SettingsFactory.validate(name, value);
    if (message) {
      errors[name] = message;
    }
  });
  return errors;
};

const selector = formValueSelector(SETTINGS_FORM_NAME);
export default withRouter(
  connect((state: AppState, props: RouteComponentProps) => {
    const category = (props.match.params as any).category;
    const settings = useSettings(getSettings(state), category);
    const newProps: any = {
      settings: {},
    };
    settings.forEach((setting) => {
      const fieldValue = selector(state, setting.name);

      if (fieldValue != setting.value) {
        newProps.settings[setting.name] = selector(state, setting.name);
      }
    });
    return newProps;
  }, null)(
    reduxForm<any, any>({
      validate,
      form: SETTINGS_FORM_NAME,
      touchOnBlur: true,
    })(Main),
  ),
);
