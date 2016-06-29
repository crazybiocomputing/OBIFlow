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

function SandBox(div_name) {
    this.name = div_name;
    this.element = document.getElementById(this.name);
    /*
    this.width  = Math.min(max_tokens,Math.max(3,num) );
    this.height = Math.ceil(num/sandbox.width);
    this.element.style.width  = sandbox.width  * TOKENSIZE;
    this.element.style.height = sandbox.height * TOKENSIZE;
    */
    this.tokens = [];
    
}

SandBox.allTokens = [
    {type: 'biotools'     , copies: 10, current: 0},
    {type: 'calcArray'    , copies: 10, current: 0},
    {type: 'calcNumber'   , copies: 10, current: 0},
    {type: 'calcString'   , copies: 10, current: 0},
    {type: 'database'     , copies: 10, current: 0},
    {type: 'filter'       , copies: 10, current: 0},
    {type: 'fold'         , copies: 10, current: 0},
    {type: 'function'     , copies: 10, current: 0},
    {type: 'hub'          , copies: 10, current: 0},
    {type: 'if_then_else' , copies: 10, current: 0},
    {type: 'input_ro'     , copies: 10, current: 0},
    {type: 'input_rw'     , copies: 10, current: 0},
    {type: 'input_cloud'  , copies: 10, current: 0},
    {type: 'input_new'    , copies: 10, current: 0},
    {type: 'map'          , copies: 10, current: 0},
    {type: 'return_filter', copies: 10, current: 0},
    {type: 'return_fold'  , copies: 10, current: 0},
    {type: 'return_map'   , copies: 10, current: 0},
    {type: 'settings'     , copies: 10, current: 0},
    {type: 'search'       , copies: 10, current: 0},
    {type: 'view'         , copies: 1 , current: 0},
    {type: 'view_plot'    , copies: 1 , current: 0}
];

SandBox.prototype.addTokens = function(toks) {
    var tokSet = toks;
    if (toks[0].type.toLowerCase() === 'all') {
        tokSet = SandBox.allTokens;
    }
    
    this.tokens = tokSet.map(
        function(token) {
            var myTok = TokenSandBoxFactory.get(token);
            return {token: myTok, copies: token.copies, current: token.current};
        }
    );

    console.log(this.tokens);
};

SandBox.prototype.init = function() {
    var self = this;
    // Update Sandbox
    //var max_tokens_per_row = Math.floor(parseInt(this.element.clientWidth) / Game.TOKENSIZE);
    //this.element.style.height = (Game.TOKENSIZE * Math.floor(this.tokens.length / max_tokens_per_row) ) + 'px';

    this.tokens.forEach(
        function (tok,index,array) {
            console.log('init Child');
            console.log(self.element);
            self.element.appendChild(tok.token.html);
            tok.token.init();
        }
    );
};


SandBox.prototype.refill = function(tok) {
    var i = 0;
    var len = this.tokens.length;
    console.log('refill');
    
    while (i < len) {
        console.log(i);
        if (tok.type === this.tokens[i].token.type) {
            this.tokens[i].current++;
            this.tokens[i].copies--;
            this.tokens[i].token.current++;
            if (this.tokens[i].copies <= 0) {
                this.tokens[i].token.getHTMLElement().style.display = 'none';
            }
            console.log(JSON.stringify(this.tokens[i]));
            // TODO
            // Move tok to board - a copy??
            // Refill sandbox with default token of the same type
            //this.tokens.push({type: tok.type}TokenFactory.get(this.tokens[i].token));
        }
        i++;
    }
};

SandBox.prototype.render = function() {
    var self = this;
    this.tokens.forEach(
        function (tok) {
            console.log('append Child');
            console.log(this.element);
            console.log(tok.token.html);
            self.element.appendChild(tok.token.html);
        }
    );
};


