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
    {type: 'biotools'     , copies: 99},
    {type: 'calcArray'    , copies: 99},
    {type: 'calcNumber'   , copies: 99},
    {type: 'calcString'   , copies: 99},
    {type: 'database'     , copies: 99},
    {type: 'filter'       , copies: 99},
    {type: 'fold'         , copies: 99},
    {type: 'function'     , copies: 99},
    {type: 'hub'          , copies: 99},
    {type: 'if_then_else' , copies: 99},
    {type: 'input_rw'     , copies: 99},
    {type: 'input_cloud'  , copies: 99},
    {type: 'input_new'    , copies: 99},
    {type: 'map'          , copies: 99},
    {type: 'return_filter', copies: 99},
    {type: 'return_fold'  , copies: 99},
    {type: 'return_map'   , copies: 99},
    {type: 'settings'     , copies: 99},
    {type: 'search'       , copies: 99},
    {type: 'view'         , copies: 1},
    {type: 'view_plot'    , copies: 1}
];

SandBox.prototype.addTokens = function(toks) {
    var tokSet = toks;
    if (toks[0].type.toLowerCase() === 'all') {
        tokSet = SandBox.allTokens;
    }
    
    this.tokens = tokSet.map(
        function(token) {
            var myTok = TokenFactory.get(token);
            return {token: myTok, copies: token.copies};
        }
    );

    console.log(this.tokens);
}

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
}


