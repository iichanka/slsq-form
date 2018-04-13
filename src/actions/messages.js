import { notification } from 'antd';

const openNotificationWithIcon = (type, title, text) => {
  notification[type]({
    message: title,
    description: text,
    duration: 7,
  });
};

export const showMessages = (messages = [], errorFound) => {
  let error = false;
  messages.map(message => {
      switch (message.type) {
        case 'S': openNotificationWithIcon('success', 'Успешно', message.text); break;
        case 'W': openNotificationWithIcon('warning', 'Предупреждение', message.text); break;
        case 'E': openNotificationWithIcon('error', 'Ошибка', message.text); break;
        case 'I': openNotificationWithIcon('info', 'Информация', message.text); break;
      }
      error = error || (message.type === 'E');
  })
  errorFound = error;
}
