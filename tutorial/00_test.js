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
 
// Global

var game;


function init() {

    // Create game
    game = new Game('crazyworkflow');
    
    // Create board
    var board = new Board('board',20,20);
    board.setViewport(6,6);
 
    // Create unlimited sandbox
    var sandbox = new SandBox('sandbox');
    sandbox.addTokens(
        [
            {type: 'all', nb: 99}
        ]
    );
    
/**
    sandbox.tokens(
        [
            {type: 'view', nb: 1},
            {type: 'inputRO', nb: 1, description: {title: 'var num &larr;', content: '6'}},
            {type: 'inputRO', nb: 1, description: {title: 'var radius &larr;', content: '100'}},
            {type: 'map', nb: 5},
            {type: 'return_map', nb: 5},
            {type: 'return_map', nb: 5},
        ]
    );
*/


    // Attach board and sandbox to game
    game.add(board);
    game.add(sandbox);
    
    // Init
    game.init();
    
    // Render
    game.render();
}



