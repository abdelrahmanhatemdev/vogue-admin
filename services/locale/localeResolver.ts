import i18n from "@/i18n";

const localeResolver = {
  get() {
    return i18n.language;
  },
};

export default localeResolver;
