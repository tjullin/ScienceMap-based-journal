    function Map() {
        this.elements = new Array();

        //获取MAP元素个数
        this.size = function () {
            return this.elements.length;
        }

        //判断MAP是否为空
        this.isEmpty = function () {
            return (this.elements.length < 1);
        }

        //删除MAP所有元素
        this.clear = function () {
            this.elements = new Array();
        }

        //向MAP中增加元素（key, value)
        this.put = function (_key, _value) {
            this.elements.push({
                key: _key,
                value: _value
            });
        }

        //删除指定KEY的元素，成功返回True，失败返回False
        this.remove = function (_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        }

        //获取指定KEY的元素值VALUE，失败返回NULL
        this.get = function (_key) {
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch (e) {
                return null;
            }
        }

        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
        this.element = function (_index) {
            if (_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        }

        //判断MAP中是否含有指定KEY的元素
        this.containsKey = function (_key) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        }

        //判断MAP中是否含有指定VALUE的元素
        this.containsValue = function (_value) {
            var bln = false;
            try {
                for (i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        }

        //获取MAP中所有VALUE的数组（ARRAY）
        this.values = function () {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        }

        //获取MAP中所有KEY的数组（ARRAY）
        this.keys = function () {
            var arr = new Array();
            for (i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        }
    }
    function colorAdd(rgb1, rgb2) {
        var r = new Array();
//        console.log(rgb1);
//        console.log(rgb2);
        for (var i = 1; i <= 3; i++) {
            var left = parseInt(rgb1[2 * i], 16) + parseInt(rgb1[2 * i - 1], 16) * 16;
            var right = parseInt(rgb2[2 * i], 16) + parseInt(rgb2[2 * i - 1], 16) * 16;
            var total = (left * 0.3 + right * 0.7);
            if (total > 255) total = 255;
            r.push(total);
        }
        return r;
    }
    function reverseColor(rgb) {
        var r = new Array();
        for (var i = 1; i <= 3; i++) {
            var ori = parseInt(rgb[2 * i], 16) + parseInt(rgb[2 * i - 1], 16) * 16;
            var total = (255 - ori) * 1.3;
            if (total > 255) total = 255;
            r.push(total);
        }
        return r;
    }
    function splitByLine(obj, max, fontsize) {
        var curLen = 0;
        var result = [];
        var start = 0, end = 0;
        for (var i = 0; i < obj.paperName.length; i++) {
            var code = obj.paperName.charCodeAt(i);
            var pixelLen = code > 255 ? fontsize : fontsize / 2;
            curLen += pixelLen;
            if (curLen > max) {
                end = i;
                result.push([obj.paperName.substring(start, end), obj.x, obj.y, obj.r]);
                start = i;
                curLen = pixelLen;
            }
            if (i === obj.paperName.length - 1) {
                end = i;
                result.push([obj.paperName.substring(start, end + 1), obj.x, obj.y, obj.r]);
            }
        }
//        console.log(result);
        return result;
    }
    function splitByComma(obj) {
        var tempstr = [["keyword:", obj.x, obj.y, obj.r ],[obj.keyword, obj.x, obj.y, obj.r],
            ["year:" + obj.year, obj.x, obj.y, obj.r],
            ["value:" + obj.value, obj.x, obj.y, obj.r]];
        return tempstr
    }