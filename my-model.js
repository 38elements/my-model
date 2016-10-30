(function(global) {
    const validator = global.validator;
    class MyModel extends global.Backbone.Model {

        get inputIds() {
            return this._inputIds;
        }

        get required() {
            return 'my-required';
        }

        get email() {
            return 'my-email';
        }

        get number() {
            return 'my-number';
        }

        get minLength() {
            return 'my-min-length';
        }

        requiredMessage(input) {
            let label = input.getAttribute('my-label');
            let message = `${label} is required.`;
            return message;
        }

        emailMessage(input) {
            let label = input.getAttribute('my-label');
            let message = `${label} is not email address.`;
            return message;
        }

        numberMessage(input) {
            let label = input.getAttribute('my-label');
            let message = `${label} is not number.`;
            return message;
        }

        minLengthMessage(input) {
            let label = input.getAttribute('my-label');
            let length = input.getAttribute('my-min-length');
            let message = `${label} is not longer than ${length}.`;
            return message;
        }

        setValidateMessage(id, type, message) {
            if (!this[id]) {
                this[id] = {};
            }
            this[id][type] = message;
        }

        validateRequired(input) {
            if (
                (input.nodeName == 'INPUT' && input.type == 'text')
                || input.nodeName == 'TEXTAREA' || input.nodeName == 'SELECT'
            ) {
                if (input.hasAttribute(this.required) && !input.value) {
                    return this.requiredMessage(input);
                }
            }
            else if(
                (input.nodeName == 'INPUT' && input.type == 'radio')
                || (input.nodeName == 'INPUT' && input.type == 'checkbox')
            ) {
                let name = input.name;
                let type = input.type;
                let radios = document.querySelectorAll(`input[type='${type}'][name='${name}']`) 
                let result = Array.from(radios).some((e) => e.checked);
                if(!result) {
                    return this.requiredMessage(input);
                }
            }
            return false;
        }

        validateEmail(input) {
            if (input.nodeName == 'INPUT' && input.type == 'text') {
                if (input.hasAttribute(this.email) && input.value
                    && !validator.isEmail(input.value)) {
                    return this.emailMessage(input);
                }
            }
            return false;
        }

        validateNumber(input) {
            if (input.nodeName == 'INPUT' && input.type == 'text') {
                if (input.hasAttribute(this.number) && input.value
                    && !validator.isNumeric(input.value)) {
                    return this.numberMessage(input);
                }
            }
            return false;
        }

        validateMinLength(input) {
            if (input.nodeName == 'INPUT' && input.type == 'text') {
                if (input.hasAttribute(this.minLength) && input.value) {
                    let min = input.getAttribute(this.minLength) - 0;
                    if (min > input.value.length) {
                        return this.minLengthMessage(input);
                    }
                }
            }
            return false;
        }

        _collect(selector, attr='value') {
            let elems = Array.from(document.querySelectorAll(selector));
            elems.forEach((t) => {
                this.set(t.id, t[attr]);
                this._inputIds.push(t.id);
            });
        }

        collect() {
            this._inputIds = [];
            this._collect('input[type=text]');
            this._collect('input[type=radio]', 'checked');
            this._collect('input[type=checkbox]', 'checked');
            this._collect('textarea');
            this._collect('select');
        }

        deliver() {
            this._inputIds.forEach((id) => {
                let input = document.getElementById(id);
                if (!input) {
                    return;
                }
                if (input.nodeName == 'INPUT' && input.type == 'text') {
                    input.value = this.get(id);
                }
                else if(input.nodeName == 'INPUT' && input.type == 'radio') {
                    input.checked = this.get(id);
                }
                else if(input.nodeName == 'INPUT' && input.type == 'checkbox') {
                    input.checked = this.get(id);
                }
                else if (input.nodeName == 'TEXTAREA') {
                    input.value = this.get(id);
                }
                else if (input.nodeName == 'SELECT') {
                    input.value = this.get(id);
                }
            });
        }

        updateResult(result, id, type, message) {
            if (message) {
                this.setValidateMessage.apply(result, [id, type, message]);
            }
            return result;
        }

        validate() {
            let result = {};
            this.collect();
            this._inputIds.forEach((id) => {
                let input = document.getElementById(id);
                if (!input) {
                    return;
                }
                let message = this.validateRequired(input);
                result = this.updateResult(result, id, 'required', message);
                message = this.validateEmail(input);
                result = this.updateResult(result, id, 'email', message);
                message = this.validateNumber(input);
                result = this.updateResult(result, id, 'number', message);
                message = this.validateMinLength(input);
                result = this.updateResult(result, id, 'min-length', message);
            });
            return Object.keys(result).length ? result : null;
        }
    }
    global.MyModel = MyModel;
})(window);
