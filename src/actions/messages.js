import { notification } from 'antd';

const openNotificationWithIcon = (type, title, text, duration = 7) => {
  if(duration.toString() === '')
  {
    duration = 7;
  }
  notification[type]({
    message: title,
    description: text,
    duration: duration,
  });
};

export const showMessages = (messages = [], errorFound) => {
  let error = false;
  messages.map(message => {
      switch (message.type) {
        case 'S': openNotificationWithIcon('success', 'Успешно', message.text, message.duration); break;
        case 'W': openNotificationWithIcon('warning', 'Предупреждение', message.text, message.duration); break;
        case 'E': openNotificationWithIcon('error', 'Ошибка', message.text, message.duration); break;
        case 'I': openNotificationWithIcon('info', 'Информация', message.text, message.duration); break;
      }
      error = error || (message.type === 'E');
  })
  errorFound = error;
}
