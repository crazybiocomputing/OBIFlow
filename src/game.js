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

function Game(div_name) {
    this.name = div_name;
    this.components = [];
    this.board;
    this.sandbox;
}

Game.TOKENSIZE = 80;

Game.HOME_FLOW = function () {
    return '../';
};


Game.prototype.add = function (component) {
    if (component instanceof Board) {
        this.board = component;
    }
    else if (component instanceof SandBox) {
        this.sandbox = component;
    }
    
    this.components.push(component);
}

Game.prototype.init = function () {
    this.components.forEach(function(el) {el.init();});
}

Game.prototype.render = function () {
    this.components.forEach(function(el) {el.render();});
}
