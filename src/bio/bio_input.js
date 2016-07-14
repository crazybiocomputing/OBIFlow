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


(function(exports) {

    function Input(x) {
        this.__value = x;
    }

    Input.of = function(data) {
        return new Input(data);
    }

    /**
     * log :: Display results in console
     *
     */
    Input.prototype.log = function() {
        console.log(JSON.stringify(this.__value) );
    }

    /**
     * map :: Obj -> Obj
     *
     */
    Input.prototype.map = function(func) {
        return Input.of(func(this.__value));
    }

    /**
     * split :: String -> [String]
     *
     */
    Input.prototype.split = function(separator) {
        var result = {title: this.__value.title};
        result.data = this.__value.data.split(separator);
        return Input.of(result);
    }
    
    /**
     * splitWord :: String -> [String]
     *
     */
    Input.prototype.splitWord = function(length) {
        var result = {title: this.__value.title};
        var regex = new RegExp('.{'+length+'}','g');
        result.data = this.__value.data.match(regex);
        
        return Input.of(result);
    }
    

    /**
     * toLowerCase :: String -> String
     *
     */
    Input.prototype.toLowerCase = function() {
        var result = {title: this.__value.title};
        result.data = this.__value.data.toLowerCase();
        return new Input(result);
    }


    /**
     *
     * E M B O S S 
     *
     */
    
    /**
    * hydropathy :: String -> [[]]
    * 
    */
    Input.prototype.hydropathy = function(settings){
	var slidingWindow = settings.slidingWindow;
	var halfWindow =  Math.floor(slidingWindow /2);
        var result = this.__value.data
            .toLowerCase()
            .split('')                                                    // <- Convert {string} into {array}
            .map(
                (x,i,array) => array.slice(i-halfWindow,i+1+halfWindow)
            )
            .filter(
                (x) => ((x.length === slidingWindow) ? true : false)        // Only get arrays of length window
            )
	   .map(
	       x =>  [x[5], Math.round(x.reduce( (total, aa) => total + Math.floor(BIO.alphabet.hydropathy_scores(aa)), 0 )/slidingWindow*100)/100]
     )            // Returns each amico acid with the mean of the window's amino acids' hydropathy

        return Input.of(result);
    }
    
    
    /**
    * threeToOne :: String -> String
    *
    */		
    Input.prototype.threeToOne = function() {
        var result = {title: this.__value.title} 
        result.data = this.__value.data
            .map(
                (x) => BIO.alphabet.amino(x.slice(0,-1)) // slice used to remove the space : "ala " -> "ala"
	    )
	    .join('').toUpperCase();
            
        return Input.of(result);
    }
    
    
     /**
     * revseq :: String -> String 
     * 
     */
    Input.prototype.revseq = function(settings) {
    	var result = {title: this.__value.title};
        result.data = this.__value.data; 

        if ( settings.nucleic_acid === "dna" ) {
            result.data = result.data
				.reduce((accu,x) => {accu.unshift(BIO.alphabet.complementNucleicDNA(x));return accu;}
                ,[])
    		.join('');
        }
        else {
            result.data = result.data
                .reduce((accu,x) => {accu.unshift(BIO.alphabet.complementNucleicRNA(x));return accu;}
                ,[])
                .join('');
        }
	return Input.of(result);
    };
   
    /**
    * transeq :: String -> [String]
    *
    */	
    Input.prototype.transeq = function(){
	var result = {title : this.__value.title}
	result.data = this.__value.data
		.split('')
		.reduce(
		    (accu, x, i, array) => {
			accu[i%3].push( array.slice(i, i+3).join('') );
			var rev_codon = Input.of({title: "", data : array.slice(i, i+3)}).revseq({nucleic_acid: "rna"}).__value.data;
			accu[i%3+3].unshift( rev_codon );
			return accu; }, [[], [], [], [], [], []]
		)
		.map(
	            frame => frame.filter( function(x){ return x.length == 3; }  ).map( x => (BIO.alphabet.genetic_code(x)) ).join('')
		);
	return Input.of(result);
    };
	
    
    
    /**
     * tm :: String -> Number
     * 
     */
     Input.prototype.tm = function () {
     	var result = {title:this.__value.title};
	result.data = this.__value.data;
	var tm = this.__value.data
		.reduce(
                (accu,x) => {accu[x]++; return accu;},
                {a:0, t:0, g:0, c:0}
            	);
	
		if (result.data.length < 14) {
			var tmCalcul = (tm.a+tm.t)*2+(tm.g+tm.c)*4;
			return Input.of(Math.round(tmCalcul*100)/100);
		}
		else {
			var tmCalcul = 64.9 + 41*(tm.g + tm.c - 16.4) / result.data.length;
			return Input.of(Math.round(tmCalcul*100)/100);
		}
     };

    /**
    * wordcount :: String -> Number
    *
    */
     Input.prototype.wordcount = function(settings) {
        var word_length = settings.word_length;
		var result = {title: this.__value.title};
		result.data = this.splitWord(word_length).__value.data.length;
		return Input.of(result);
    }
    
    /**
    * compseq :: String -> Obj
    *
    */
     Input.prototype.compseq = function(){
	var result = {title: this.__value.title};
	result.data = this.__value.data
		.split('')
		.reduce(
			(accu, x) => ( accu[x] = accu[x]+1, accu), {'A':0, 'C':0, 'G':0, 'T':0}
		)
	return Input.of(result);
      }
      
     /**
      * transcription :: String -> String
      * 
      */
      Input.prototype.transcription = function() {
      	var result = {title:"arn"};
        result.data = this.__value.data 
            .reduce( 
                (accu, x) => {accu.push(BIO.alphabet.transcription(x)); return accu;},
            [])
            .join('');
        return Input.of(result);
    }
    
    /**
     * isComplementary:: Obj -> Boolean
     * 
     */
     Input.prototype.isComplementary = function() {
     	var result = {type : "adn"};
        result.data1 = this.__value.data1
        	.split('')
		.reduce((accu,x) => {accu.push(BIO.alphabet.complementNucleicDNA(x));return accu;}
                ,[]
                )
            	.join('');
        result.data2 = this.__value.data2
        return Input.of((result.data1 === result.data2) ? true : false);
    }
   


    exports.Input = Input;
    
})(this.BIO = this.BIO || {} );



