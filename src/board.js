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

function Board(div_name,w,h) {

    this.name = div_name;
    this.height = h;
    this.width  = w;
    this.cells  = new Array(w * h);
    this.cells.fill(0);
    this.viewport = {w: w, h: h};
    this.tokens = [];

}

Board.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


Board.prototype.setViewport = function (w,h) {
    this.viewport.w = w;
    this.viewport.h = h;
}

Board.prototype.addToken = function(options) {
    var newTok = TokenFactory.get(options);
    
    newTok.cell_x = 0;
    newTok.cell_y = 0;

    document.getElementById(this.name).appendChild(newTok.html);

    newTok.init();
    this.tokens.push(newTok);
    // Update sandbox
    game.sandbox.refill(newTok);
}

Board.prototype.init = function () {
    // TODO
    document.getElementById(this.name).setAttribute("style",'width:'  + (this.viewport.w * Game.TOKENSIZE) + 'px'); 
    document.getElementById(this.name).setAttribute("style",'height:' + (this.viewport.h * Game.TOKENSIZE) + 'px');

}

Board.prototype.render = function () {
    // TODO

}
