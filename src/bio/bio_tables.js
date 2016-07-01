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



BIO.alphabet = {};

BIO.alphabet.amino = function(symbol) {
        return {
            'a':'ala', 'ala':'a',
            'r':'arg', 'arg':'r',
            'n':'asn',
            'd':'asp',
            'c':'cys',
            'q':'gln',
            'e':'glu',
            'g':'gly',
            'h':'his',
            'i':'ile',
            'l':'leu',
            'k':'lys',
            'm':'met',
            'f':'phe',
            'p':'pro',
            's':'ser',
            't':'thr',
            'w':'trp',
            'y':'tyr',
            'v':'val',
            'b':'asx',
            'z':'glx',
            'x':'xxx'
        }[symbol];
};

BIO.alphabet.nucleic = function(symbol) {
};
