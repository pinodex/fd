/**
 * author: Raphael Marco (raphaelmarco.me)
 * Copyright 2016
 */

(function Application() {

    var methods = {
        reset: function () {
            this.computedValues = {
                n: 0,
                h: 0,
                l: 0,
                r: 0,
                k: 0,
                i: 0,
                mean: 0,
                sumF: 0,
                sumM: 0,
                sumXMinXBar: 0,
                sumXMinXBarSquared: 0,
                sumFXMinXBarSquared: 0
            };
        },

        update: function () {
            this.parseData();
            this.compute();
            this.generateTable();
        },

        parseData: function () {
            this.sortedData = [];

            var entries = this.rawData.split(',');

            for (var i = 0; i < entries.length; i++) {
                this.sortedData.push(Number(entries[i]));
            };

            this.sortedData = this.sortedData.sort(function sort (a, b) {
                return a - b;
            });
        },

        compute: function () {
            this.computedValues.n = this.sortedData.length;
            this.computedValues.h = this.sortedData[this.sortedData.length - 1];
            this.computedValues.l = this.sortedData[0];
            this.computedValues.r = this.computedValues.h - this.computedValues.l;

            this.computedValues.k = 1;

            while (Math.pow(2, this.computedValues.k) < this.computedValues.r) {
                this.computedValues.k++;
            }

            this.computedValues.i = Math.ceil(this.computedValues.r / this.computedValues.k);
        },

        generateTable: function () {
            this.data = [];

            lastLow = this.computedValues.l;
            lastHigh = this.computedValues.l + this.computedValues.i - 1;

            for (var i = 0; i < this.computedValues.k; i++) {
                var entry = {};

                entry.classLimit = {
                    h: lastHigh,
                    l: lastLow
                };

                entry.classBoundaries = {
                    h: entry.classLimit.h + 0.5,
                    l: entry.classLimit.l - 0.5
                };

                entry.f = 0;

                for (var k = 0; k < this.sortedData.length; k++) {
                    if (this.sortedData[k] >= entry.classBoundaries.l && this.sortedData[k] <= entry.classBoundaries.h) {
                        entry.f++;
                    }
                };

                entry.mid = (entry.classLimit.h + entry.classLimit.l) / 2;
                entry.fx = entry.f * entry.mid;

                this.computedValues.sumM += entry.mid;
                this.data.push(entry);

                lastLow = lastHigh + 1;
                lastHigh = lastHigh + this.computedValues.i;
            };

            this.computedValues.mean = +(this.computedValues.sumM / this.computedValues.n).toFixed(2);

            for (var i = 0; i < this.data.length; i++) {
                this.data[i].XMinXBar = +(this.data[i].mid - this.computedValues.mean).toFixed(4);
                this.data[i].XMinXBarSquared = +Math.pow(this.data[i].XMinXBar, 2).toFixed(4);
                this.data[i].FXMinXBarSquared = +(this.data[i].f * this.data[i].XMinXBarSquared).toFixed(4);

                this.computedValues.sumF += this.data[i].f;
                this.computedValues.sumXMinXBar += this.data[i].XMinXBar;
                this.computedValues.sumXMinXBarSquared += this.data[i].XMinXBarSquared;
                this.computedValues.sumFXMinXBarSquared += this.data[i].FXMinXBarSquared;
            };

            this.computedValues.sumXMinXBar = +this.computedValues.sumXMinXBar.toFixed(2);
            this.computedValues.sumXMinXBarSquared = +this.computedValues.sumXMinXBarSquared.toFixed(2);
            this.computedValues.sumFXMinXBarSquared = +this.computedValues.sumFXMinXBarSquared.toFixed(2);
        }
    };
    
    var app = new Vue({
        el: '#app',
        methods: methods,
        
        data: {
            showOutput: false,
            computedValues: {
                n: 0,
                h: 0,
                l: 0,
                r: 0,
                k: 0,
                i: 0,
                mean: 0,
                sumF: 0,
                sumM: 0,
                sumXMinXBar: 0,
                sumXMinXBarSquared: 0,
                sumFXMinXBarSquared: 0
            },
            sortedData: [],
            rawData: '',
            data: []
        },

        watch: {
            rawData: function () {
                this.reset();
                this.update();

                if (this.rawData.trim().length == 0) {
                    this.sortedData = [];
                    this.data = [];

                    this.reset();
                }
            }
        }
    });

}());