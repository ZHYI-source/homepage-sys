import {Modal, message, notification} from 'ant-design-vue';

export const ZyConfirm = function (content, title = '提示') {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            title: '提示',
            content: content,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            },
        });
    })
}

class Message {
    info(content = '提示信息', duration) {
        return this.showMessage('info', content, duration);
    }

    success(content = '成功信息', duration) {
        return this.showMessage('success', content, duration);
    }

    warning(content = '警告信息', duration) {
        return this.showMessage('warning', content, duration);
    }

    error(content = '错误信息', duration) {
        return this.showMessage('error', content, duration);
    }

    showMessage(type, content, duration) {
        return message[type](content, duration);
    }
}

class Notification {
    info(description, message = '提示') {
        return this.showNotification('info', description, message);
    }

    success(description, message = '成功') {
        return this.showNotification('success', description, message);
    }

    warning(description, message = '警告') {
        return this.showNotification('warning', description, message);
    }

    error(description, message = '错误') {
        return this.showNotification('error', description, message);
    }

    showNotification(type, description, message) {
        return notification[type]({
            message,
            description,
        });
    }
}

export const ZyMessage = new Message();
export const ZyNotification = new Notification();
