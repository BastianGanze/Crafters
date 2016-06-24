"use strict";
var Input;
(function (Input) {
    //Define all buttons/actions which are possible here
    (function (Buttons) {
        Buttons[Buttons["JUMP"] = 0] = "JUMP";
        Buttons[Buttons["LEFT"] = 1] = "LEFT";
        Buttons[Buttons["RIGHT"] = 2] = "RIGHT";
        Buttons[Buttons["UP"] = 3] = "UP";
        Buttons[Buttons["DOWN"] = 4] = "DOWN";
    })(Input.Buttons || (Input.Buttons = {}));
    var Buttons = Input.Buttons;
    //Define additional input, which is not mapped to the keyboard here
    (function (CustomInput) {
        CustomInput[CustomInput["X_AXIS"] = 0] = "X_AXIS";
        CustomInput[CustomInput["Y_AXIS"] = 1] = "Y_AXIS";
    })(Input.CustomInput || (Input.CustomInput = {}));
    var CustomInput = Input.CustomInput;
    //Actual player input. Use this to create key bindings for multiple players.
    var PlayerInput = (function () {
        function PlayerInput() {
            var $document = $(document);
            $document.keydown(this.onKeyDown.bind(this));
            $document.keyup(this.onKeyUp.bind(this));
            this.keyBindings = {};
            this.keyPressedMap = {};
            this.customBindings = {};
            //Setting some standard callback functions for x and y axis
            this.xAxisCallback = function () {
                if (this.isButtonPressed(Buttons.LEFT))
                    return -1;
                if (this.isButtonPressed(Buttons.RIGHT))
                    return 1;
                return 0;
            }.bind(this);
            this.yAxisCallback = function () {
                if (this.isButtonPressed(Buttons.UP))
                    return -1;
                if (this.isButtonPressed(Buttons.DOWN))
                    return 1;
                return 0;
            }.bind(this);
        }
        PlayerInput.prototype.setKeyboardBinding = function (button, key) {
            this.keyBindings[button] = key;
            this.keyPressedMap[key] = 0;
        };
        PlayerInput.prototype.setCustomBinding = function (inputName, currentValueFunction) {
            this.customBindings[inputName] = currentValueFunction;
        };
        PlayerInput.prototype.setXAxisCallback = function (callback) {
            this.xAxisCallback = callback;
        };
        PlayerInput.prototype.setYAxisCallback = function (callback) {
            this.yAxisCallback = callback;
        };
        PlayerInput.prototype.getXAxis = function () {
            return this.xAxisCallback();
        };
        PlayerInput.prototype.getYAxis = function () {
            return this.yAxisCallback();
        };
        /**
         * Will return true if Button is being pressed at the time of this function call.
         * @param button
         * @returns {boolean}
         */
        PlayerInput.prototype.isButtonPressed = function (button) {
            return this.keyPressedMap[this.keyBindings[button]] === 1;
        };
        PlayerInput.prototype.getCustomInputValue = function (inputName) {
            return this.customBindings[inputName]();
        };
        PlayerInput.prototype.onKeyDown = function (e) {
            var keyCode = e.which;
            this.keyPressedMap[keyCode] = 1;
        };
        PlayerInput.prototype.onKeyUp = function (e) {
            var keyCode = e.which;
            this.keyPressedMap[keyCode] = 0;
        };
        return PlayerInput;
    }());
    Input.PlayerInput = PlayerInput;
    (function (KeyCodes) {
        KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
        KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
        KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
        KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
        KeyCodes[KeyCodes["CTRL"] = 17] = "CTRL";
        KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
        KeyCodes[KeyCodes["PAUSE"] = 19] = "PAUSE";
        KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
        KeyCodes[KeyCodes["ESCAPE"] = 27] = "ESCAPE";
        KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
        KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
        KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
        KeyCodes[KeyCodes["END"] = 35] = "END";
        KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
        KeyCodes[KeyCodes["LEFT_ARROW"] = 37] = "LEFT_ARROW";
        KeyCodes[KeyCodes["UP_ARROW"] = 38] = "UP_ARROW";
        KeyCodes[KeyCodes["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
        KeyCodes[KeyCodes["DOWN_ARROW"] = 40] = "DOWN_ARROW";
        KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
        KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
        KeyCodes[KeyCodes["KEY_0"] = 48] = "KEY_0";
        KeyCodes[KeyCodes["KEY_1"] = 49] = "KEY_1";
        KeyCodes[KeyCodes["KEY_2"] = 50] = "KEY_2";
        KeyCodes[KeyCodes["KEY_3"] = 51] = "KEY_3";
        KeyCodes[KeyCodes["KEY_4"] = 52] = "KEY_4";
        KeyCodes[KeyCodes["KEY_5"] = 53] = "KEY_5";
        KeyCodes[KeyCodes["KEY_6"] = 54] = "KEY_6";
        KeyCodes[KeyCodes["KEY_7"] = 55] = "KEY_7";
        KeyCodes[KeyCodes["KEY_8"] = 56] = "KEY_8";
        KeyCodes[KeyCodes["KEY_9"] = 57] = "KEY_9";
        KeyCodes[KeyCodes["A"] = 65] = "A";
        KeyCodes[KeyCodes["B"] = 66] = "B";
        KeyCodes[KeyCodes["C"] = 67] = "C";
        KeyCodes[KeyCodes["D"] = 68] = "D";
        KeyCodes[KeyCodes["E"] = 69] = "E";
        KeyCodes[KeyCodes["F"] = 70] = "F";
        KeyCodes[KeyCodes["G"] = 71] = "G";
        KeyCodes[KeyCodes["H"] = 72] = "H";
        KeyCodes[KeyCodes["I"] = 73] = "I";
        KeyCodes[KeyCodes["J"] = 74] = "J";
        KeyCodes[KeyCodes["K"] = 75] = "K";
        KeyCodes[KeyCodes["L"] = 76] = "L";
        KeyCodes[KeyCodes["M"] = 77] = "M";
        KeyCodes[KeyCodes["N"] = 78] = "N";
        KeyCodes[KeyCodes["O"] = 79] = "O";
        KeyCodes[KeyCodes["P"] = 80] = "P";
        KeyCodes[KeyCodes["Q"] = 81] = "Q";
        KeyCodes[KeyCodes["R"] = 82] = "R";
        KeyCodes[KeyCodes["S"] = 83] = "S";
        KeyCodes[KeyCodes["T"] = 84] = "T";
        KeyCodes[KeyCodes["U"] = 85] = "U";
        KeyCodes[KeyCodes["V"] = 86] = "V";
        KeyCodes[KeyCodes["W"] = 87] = "W";
        KeyCodes[KeyCodes["X"] = 88] = "X";
        KeyCodes[KeyCodes["Y"] = 89] = "Y";
        KeyCodes[KeyCodes["Z"] = 90] = "Z";
        KeyCodes[KeyCodes["LEFT_META"] = 91] = "LEFT_META";
        KeyCodes[KeyCodes["RIGHT_META"] = 92] = "RIGHT_META";
        KeyCodes[KeyCodes["SELECT"] = 93] = "SELECT";
        KeyCodes[KeyCodes["NUMPAD_0"] = 96] = "NUMPAD_0";
        KeyCodes[KeyCodes["NUMPAD_1"] = 97] = "NUMPAD_1";
        KeyCodes[KeyCodes["NUMPAD_2"] = 98] = "NUMPAD_2";
        KeyCodes[KeyCodes["NUMPAD_3"] = 99] = "NUMPAD_3";
        KeyCodes[KeyCodes["NUMPAD_4"] = 100] = "NUMPAD_4";
        KeyCodes[KeyCodes["NUMPAD_5"] = 101] = "NUMPAD_5";
        KeyCodes[KeyCodes["NUMPAD_6"] = 102] = "NUMPAD_6";
        KeyCodes[KeyCodes["NUMPAD_7"] = 103] = "NUMPAD_7";
        KeyCodes[KeyCodes["NUMPAD_8"] = 104] = "NUMPAD_8";
        KeyCodes[KeyCodes["NUMPAD_9"] = 105] = "NUMPAD_9";
        KeyCodes[KeyCodes["MULTIPLY"] = 106] = "MULTIPLY";
        KeyCodes[KeyCodes["ADD"] = 107] = "ADD";
        KeyCodes[KeyCodes["SUBTRACT"] = 109] = "SUBTRACT";
        KeyCodes[KeyCodes["DECIMAL"] = 110] = "DECIMAL";
        KeyCodes[KeyCodes["DIVIDE"] = 111] = "DIVIDE";
        KeyCodes[KeyCodes["F1"] = 112] = "F1";
        KeyCodes[KeyCodes["F2"] = 113] = "F2";
        KeyCodes[KeyCodes["F3"] = 114] = "F3";
        KeyCodes[KeyCodes["F4"] = 115] = "F4";
        KeyCodes[KeyCodes["F5"] = 116] = "F5";
        KeyCodes[KeyCodes["F6"] = 117] = "F6";
        KeyCodes[KeyCodes["F7"] = 118] = "F7";
        KeyCodes[KeyCodes["F8"] = 119] = "F8";
        KeyCodes[KeyCodes["F9"] = 120] = "F9";
        KeyCodes[KeyCodes["F10"] = 121] = "F10";
        KeyCodes[KeyCodes["F11"] = 122] = "F11";
        KeyCodes[KeyCodes["F12"] = 123] = "F12";
        KeyCodes[KeyCodes["NUM_LOCK"] = 144] = "NUM_LOCK";
        KeyCodes[KeyCodes["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
        KeyCodes[KeyCodes["SEMICOLON"] = 186] = "SEMICOLON";
        KeyCodes[KeyCodes["EQUALS"] = 187] = "EQUALS";
        KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
        KeyCodes[KeyCodes["DASH"] = 189] = "DASH";
        KeyCodes[KeyCodes["PERIOD"] = 190] = "PERIOD";
        KeyCodes[KeyCodes["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
        KeyCodes[KeyCodes["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
        KeyCodes[KeyCodes["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
        KeyCodes[KeyCodes["BACK_SLASH"] = 220] = "BACK_SLASH";
        KeyCodes[KeyCodes["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
        KeyCodes[KeyCodes["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
    })(Input.KeyCodes || (Input.KeyCodes = {}));
    var KeyCodes = Input.KeyCodes;
})(Input = exports.Input || (exports.Input = {}));
//# sourceMappingURL=Input.js.map