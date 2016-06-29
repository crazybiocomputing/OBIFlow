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

function TokenSandBox(options) {
    // Init
    this.ID = options.ID || 'UNK__TOK';
    this.type = options.type || 'unknown';
    this.name = options.name || 'unknown';
    this.current = options.current || 0;
    this.description = options.description  || {title:'None',contents:''};
    this.title = options.title || 'No title';

    // Geometry and Board location
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.cell_x = (options.cell_x != undefined) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != undefined) ? options.cell_y : -1;
    

    // New ??
    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}


TokenSandBox.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


TokenSandBox.prototype.init = function() {

    var self = this;
    var el = document.getElementById(self.name);

    // Click to open popup
    function click(ev) {
        ev = ev || window.event;
        console.log('click '+self.ID+' '+self.type);
        
        game.board.addToken({type: self.type,name: self.type+'_'+self.current});
        
        return false;
    }




    el.addEventListener("mouseup", 
        function (ev) {
            self.dragMode = false;
            console.log('mouseup '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            var el = document.getElementById(self.name);
            el.style.zIndex = 1;
            var viewportOffset = game.board.getHTMLElement().getBoundingClientRect();
            // these are relative to the viewport

            var cell_x = self.xStart - parseInt(viewportOffset.left);
            var cell_y = self.yStart - parseInt(viewportOffset.top);

            cell_x /= Game.TOKENSIZE;
            cell_y /= Game.TOKENSIZE;
            
            // Clamp
            cell_x = Math.min(Math.max(Math.floor(cell_x), 0.0), parseFloat(game.board.width - 1));
            cell_y = Math.min(Math.max(Math.floor(cell_y), 0.0), parseFloat(game.board.height - 1));
            
            console.log('board ' + cell_x +' '+cell_y+' '+game.board.cells[cell_x + game.board.width * cell_y] );

            if (game.board.cells[cell_x + game.board.width * cell_y] === 0) {    
                // Update board and **this** token
                if (self.status === -1) {
                    self.status = 0;
                    // Update sandbox
                    game.sandbox.refill(self);
                }
                else
                    game.board.cells[self.cell_x + game.board.width * self.cell_y] = 0;

                self.cell_x = cell_x;
                self.cell_y = cell_y;
                game.board.cells[self.cell_x + game.board.width * self.cell_y] = self.ID;
                
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            else {
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            

            el.addEventListener('click',click);
        },
        false);
        
}



