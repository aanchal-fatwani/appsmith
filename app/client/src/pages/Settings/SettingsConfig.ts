import _ from "lodash";
import { isEmail } from "utils/formhelpers";

export enum SettingTypes {
  TEXTINPUT = "TEXTINPUT",
  TOGGLE = "TOGGLE",
  LINK = "LINK",
  BUTTON = "BUTTON",
  GROUP = "GROUP",
}

export enum SettingSubtype {
  EMAIL = "email",
  TEXT = "text",
  NUMBER = "number",
  PASSWORD = "password",
}

export type Setting = {
  category: string;
  controlType: SettingTypes;
  controlSubType?: SettingSubtype;
  helpText?: string;
  label: string;
  name?: string;
  placeholder?: string;
  validate?: (value: string, setting?: Setting) => string | void;
  url?: string;
  children?: any;
  subCategory?: string;
};

export class SettingsFactory {
  static settingsMap: Record<string, Setting> = {};
  static categories: Set<string> = new Set();

  static register(name: string, options: Setting) {
    SettingsFactory.categories.add(options.category);
    SettingsFactory.settingsMap[name] = options;
  }

  static validate(name: string, value: string) {
    const setting = SettingsFactory.settingsMap[name];
    if (setting?.validate) {
      return setting.validate(value, setting);
    }

    return "";
  }

  static get(config: any, category: string) {
    const settings: any[] = [];
    const subCategoryMap: any = {};

    _.forEach(SettingsFactory.settingsMap, (options, name) => {
      if (options.category !== category) {
        return;
      }
      if (options.subCategory) {
        if (!subCategoryMap[options.subCategory]) {
          subCategoryMap[options.subCategory] = {
            name: options.subCategory,
            controlType: SettingTypes.GROUP,
            children: [],
          };
          settings.push(subCategoryMap[options.subCategory]);
        }
        subCategoryMap[options.subCategory].children.push({
          name,
          value:
            options.controlType == "TOGGLE"
              ? (config[name] || "").toString() == "true"
              : config[name],
          ...options,
        });
      } else {
        settings.push({
          name,
          value:
            options.controlType == "TOGGLE"
              ? (config[name] || "").toString() == "true"
              : config[name],
          ...options,
        });
      }
    });

    return settings;
  }
}

//EMAIL
SettingsFactory.register("APPSMITH_MAIL_HOST", {
  category: "email",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "SMTP Host",
  placeholder: "smtp.yourservice.com",
  validate: (value: string) => {
    if (
      value &&
      !/^(smtps?):\/\/([\d.a-z-]+\.[a-z]{2,63}):(\d{1,5})/.test(value)
    ) {
      return "please enter a valid SMTP host";
    }
  },
});

SettingsFactory.register("APPSMITH_MAIL_PORT", {
  category: "email",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.NUMBER,
  placeholder: "25",
  label: "SMTP Port",
  validate: (value: string) => {
    const port = parseInt(value);
    if (value && (typeof port != "number" || port < 0 || port > 65535)) {
      return "Please enter a valid port";
    }
  },
});

SettingsFactory.register("APPSMITH_MAIL_SMTP_TLS_ENABLED", {
  category: "email",
  controlType: SettingTypes.TOGGLE,
  label: "TLS Protected Connection",
});

SettingsFactory.register("APPSMITH_MAIL_USERNAME", {
  category: "email",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "SMTP Username",
  placeholder: "smtp.yourservice.com",
});

SettingsFactory.register("APPSMITH_MAIL_PASSWORD", {
  category: "email",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.PASSWORD,
  label: "SMTP Password",
  placeholder: "smtp.yourservice.com",
});

SettingsFactory.register("APPSMITH_MAIL_FROM", {
  category: "email",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "From Address",
  placeholder: "smtp.yourservice.com",
  validate: (value: string) => {
    if (value && !isEmail(value)) {
      return "Please enter a valid email id";
    }
  },
});

//General
SettingsFactory.register("APPSMITH_INSTANCE_NAME", {
  category: "general",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "Instance Name",
  placeholder: "appsmith/prod",
});

SettingsFactory.register("APPSMITH_ADMIN_EMAILS", {
  category: "general",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.EMAIL,
  label: "Admin Email",
  helpText: "Comma seperated email Ids",
  validate: (value: string) => {
    if (
      value &&
      !value
        .split(",")
        .reduce((prev, curr) => prev && isEmail(curr.trim()), true)
    ) {
      return "Please enter valid email id(s)";
    }
  },
});

SettingsFactory.register("APPSMITH_DISABLE_TELEMETRY", {
  category: "general",
  controlType: SettingTypes.TOGGLE,
  label: "Anonymous Tracking",
});

//goolge maps
SettingsFactory.register("APPSMITH_GOOGLE_MAPS_API_KEY", {
  category: "google-maps",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "API Key",
});

SettingsFactory.register("APPSMITH_GOOGLE_MAPS_GUIDE", {
  category: "google-maps",
  controlType: SettingTypes.LINK,
  label: "Guide to generate API Key",
  url: "https://www.google.com",
});

//authentication
SettingsFactory.register("APPSMITH_SIGNUP_DISABLED", {
  category: "authentication",
  controlType: SettingTypes.TOGGLE,
  label: "Form Signup",
});

SettingsFactory.register("APPSMITH_OAUTH2_GOOGLE_CLIENT_ID", {
  category: "authentication",
  subCategory: "google signup",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "Client ID",
});

SettingsFactory.register("APPSMITH_SIGNUP_ALLOWED_DOMAINS", {
  category: "authentication",
  subCategory: "google signup",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "Allowed Domains",
});

SettingsFactory.register("APPSMITH_OAUTH2_GOOGLE_CLIENT_SECRET", {
  category: "authentication",
  subCategory: "google signup",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "Client Secret",
});

SettingsFactory.register("APPSMITH_OAUTH2_GITHUB_CLIENT_ID", {
  category: "authentication",
  subCategory: "github signup",
  controlType: SettingTypes.TEXTINPUT,
  controlSubType: SettingSubtype.TEXT,
  label: "Client ID",
});
