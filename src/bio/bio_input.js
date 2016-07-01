/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


(function(exports) {

    function Input(x) {
        this.data = x;
    }

    Input.of = function(data) {
        return new Input(data);
    }

    Input.prototype.wordcount = function(settings) {
        // settings.word_length
        // TODO
        return Input.of(this.data);
    }


    Input.prototype.hydropathy = function(settings){
        var halfWindow = settings[slidingWindow]/2;
        var result = (' '.repeat(halfWindow) + sequence.data + ' '.repeat(halfWindow))
            .toLowerCase()
            .split('')                                                     // <- Convert {string} into {array}
            .map(
                (x,i,array) => array.slice(i-halfWindow,i+1+halfWindow)
            )
            .filter(
                (x) => ((x.length === slidingWindow) ? true : false)                // Only get arrays of length window
            )
            .map(
    //            (x) => x.reduce( (total,aa) => total += Math.floor(Math.random()*10.0),0) 
                (x) => [x[5],x.reduce( (total,aa) => total += Math.floor(Math.random()*10.0),0) / slidingWindow ]
            );
        return Input.of(result);
    }

    Input.prototype.log = function() {
        console.log(JSON.stringify(this.data) );
    }


    exports.Input = Input;
    
})(this.BIO = this.BIO || {} );


