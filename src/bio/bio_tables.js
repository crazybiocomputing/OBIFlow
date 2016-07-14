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
 * Jean-Christophe Taveau, Kristina Kastano, Savandara Besse 
 */

var BIO = BIO || {};

BIO.alphabet = {};

BIO.alphabet.amino = function(symbol) {
        return {
            'a':'ala', 'ala':'a',
            'r':'arg', 'arg':'r',
            'n':'asn', 'asn':'n',
            'd':'asp', 'asp':'d',
            'c':'cys', 'cys':'c',
            'q':'gln', 'gln':'q',
            'e':'glu', 'glu':'e',
            'g':'gly', 'gly':'g',
            'h':'his', 'his':'h',
            'i':'ile', 'ile':'i',
            'l':'leu', 'leu':'l',
            'k':'lys', 'lys':'k',
            'm':'met', 'met':'m',
            'f':'phe', 'phe':'f',
            'p':'pro', 'pro':'p',
            's':'ser', 'ser':'s',
            't':'thr', 'thr':'t',
            'w':'trp', 'trp':'w',
            'y':'tyr', 'tyr':'y',
            'v':'val', 'val':'v',
            'b':'asx', 'asx':'b', 
            'z':'glx', 'glx':'z', 
            'x':'xxx', 'xxx':'x'
        }[symbol];
};

/* Kyte-Doolittle scale */
BIO.alphabet.hydropathy_scores = function(symbol){
    return {
	'i' : 4.5,
	'v' : 4.2,
	'l' : 3.8,
	'f' : 2.8,
	'c' : 2.5,
	'm' : 1.9,
	'a' : 1.8,
	'g' : -0.4,
	't' : -0.7,
	'w' : -0.9,
	's' : -0.8,
	'y' : -1.3,
	'p' : -1.6,
	'h' : -3.2,
	'e' : -3.5,
	'q' : -3.5,
	'd' : -3.5,
	'n' : -3.5,
	'k' : -3.9,
	'r' : -4.5
    }[symbol]
};


BIO.alphabet.genetic_code = function(symbol) {
    return {
        'uuu': 'F', 'ucu': 'S', 'uau': 'Y', 'ugu': 'C',
        'uuc': 'F', 'ucc': 'S', 'uac': 'Y', 'ugc': 'C',
        'uua': 'L', 'uca': 'S', 'uaa': '*', 'uga': '*',
        'uug': 'L', 'ucg': 'S', 'uag': '*', 'ugg': 'W',
        'cuu': 'L', 'ccu': 'P', 'cau': 'H', 'cgu': 'R',
        'cuc': 'L', 'ccc': 'P', 'cac': 'H', 'cgc': 'R',
        'cua': 'L', 'cca': 'P', 'caa': 'Q', 'cga': 'R',
        'cug': 'L', 'ccg': 'P', 'cag': 'Q', 'cgg': 'R',
        'auu': 'I', 'acu': 'T', 'aau': 'N', 'agu': 'S',
        'auc': 'I', 'acc': 'T', 'aac': 'N', 'agc': 'S',
        'aua': 'I', 'aca': 'T', 'aaa': 'K', 'aga': 'R',
        'aug': 'M', 'acg': 'T', 'aag': 'K', 'agg': 'R',
        'guu': 'V', 'gcu': 'A', 'gau': 'D', 'ggu': 'G',
        'guc': 'V', 'gcc': 'A', 'gac': 'D', 'ggc': 'G',
        'gua': 'V', 'gca': 'A', 'gaa': 'E', 'gga': 'G',
        'gug': 'V', 'gcg': 'A', 'gag': 'E', 'ggg': 'G',
        }[symbol]
};

BIO.alphabet.nucleic = function(symbol) {
};

BIO.alphabet.complementNucleicDNA = function(symbol) {
	return {
		't':'a', 
		'a':'t',
		'c':'g', 
		'g':'c'	
	}[symbol];
};

BIO.alphabet.complementNucleicRNA = function(symbol) {
	return {
		'u':'a', 
		'a':'u',
		'c':'g', 
		'g':'c'	
	}[symbol];
};

BIO.alphabet.transcription = function(symbol) {
		return {
			'a':'a', 
			't':'u',
			'c':'c', 
			'g':'g'	
		}[symbol];
	};
