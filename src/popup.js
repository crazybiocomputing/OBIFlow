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

function Popup(div_name) {

    this.name = div_name;

}

Popup.prototype.addContent = function() {
    return document.getElementById(this.name);
};


Popup.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};

Popup.prototype.init = function () {
    // TODO
    var self = this;
    var el = document.getElementById(this.name); 
    
    // Close button
    var closeB = document.querySelector('#' + this.name + ' .titlebar #close');
    closeB.addEventListener(
        'click',
        function(ev) {
            document.getElementById(self.name).style.display = 'none';
        }
    );
    
    // Titlebar
    var titlebar = document.querySelector('#' + this.name + ' .titlebar');
    titlebar.addEventListener(
        'mousedown',
        function(ev) {
            // TODO;
        }
    );

    titlebar.addEventListener(
        'mousemove',
        function(ev) {
            // TODO;
        }
    );

    titlebar.addEventListener(
        'mouseup',
        function(ev) {
            // TODO;
        }
    );

}

Popup.prototype.render = function () {
    // TODO

}
