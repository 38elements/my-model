(function(global) {
    const validator = global.validator;
    class MyModel extends global.Backbone.Model {

        get inputIds() {
            return this._inputIds;
        }

        get required() {
            return 'my-required';
        }

        required_message(input) {
            let label = input.getAttribute('my-label');
            let message = `${label} is required.`;
            return message;
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
            this._collect('input[type=redio]', 'checked');
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
                else if(input.nodeName == 'INPUT' && input.type == 'redio') {
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

        validate() {
            let result = {};
            this._inputIds.forEach((id) => {
                let input = document.getElementById(id);
                if (!input) {
                    return;
                }
                if (input.nodeName == 'INPUT' && input.type == 'text') {
                    if (input.hasAttribute(this.required) && !input.value) {
                        if (!result.id) {
                            result[id] = {};
                        }
                        result[id]['required'] = this.required_message(input);
                    }
                }
                else if(input.nodeName == 'INPUT' && input.type == 'redio') {
                }
                else if(input.nodeName == 'INPUT' && input.type == 'checkbox') {
                }
                else if (input.nodeName == 'TEXTAREA') {
                }
                else if (input.nodeName == 'SELECT') {
                }

            });
            return Object.keys(result).length ? result : false;
        }
    }
    global.MyModel = MyModel;
})(window);
