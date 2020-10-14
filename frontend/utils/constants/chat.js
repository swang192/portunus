export const ZENDESK_CHAT_KEY = '5ab22e5d-b8a6-49f9-b680-6e82e5d036aa';
export const ZENDESK_CHAT_DEPARTMENT = 'Members';
export const ZENDESK_WIDGET_URL = `https://static.zdassets.com/ekr/snippet.js?key=${ZENDESK_CHAT_KEY}`;

export const setDepartment = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.zESettings = {
    webWidget: {
      chat: {
        departments: {
          enabled: [ZENDESK_CHAT_DEPARTMENT],
        },
      },
    },
  };
};
