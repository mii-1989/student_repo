tiles = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
tile_state = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
const buttons = document.getElementsByTagName("button");
const result = document.getElementById("result");
const debug = document.getElementById("debug");
/*
0 - Cleared tile
1- opened tile
2 - closed tile


*/
//================================================================
function start()
{
    for (let button of buttons) {
    
        button.addEventListener("click", buttonPressed);
        button.innerHTML = tiles[button.id];
        button.style.fontSize=3;
    }
    updateCardsView();
}

function updateCardsView()
{
    for ( let button of buttons)
    {
        /*if (tiles[button.id] < 0 ) button.innerHTML = tiles[button.id];
        if (tiles[button.id] === 0) button.innerHTML = "X";
        if (tiles[button.id] > 0 ) button.innerHTML = tiles[button.id];
        */

        if (tile_state[button.id] == 1) button.innerHTML = tiles[button.id];
        if (tile_state[button.id] == 2) button.innerHTML = "?";
        if (tile_state[button.id] == 0) button.innerHTML = "X";


    }
}


click_counter = 0;
primaryCardValue = 0;
primaryCardIndex = -1;
secondaryCardValue = 0;
secondaryCardIndex = -1;
cardsRemainedCount = 16;
accept_clicks = true;
cleanupMatchedTiles = false;
resetUnmatchedTiles = false;
dump_tile_one = -1;
dump_tile_two = -1;
reset_tile_one = -1;
reset_tile_two = -1;
console.log(tiles);

function showTile(i)
{
    tile_state[i] = 1;
    updateCardsView();
}
function hideTile(i)
{
    tile_state[i] = 2;
    updateCardsView();
}
function clearTile(i)
{
    tile_state[i] = 0;
    updateCardsView();
}
function isTileOpened(i)
{
    if (tile_state[i] == 1) return true;
}
function isTileClosed(i)
{
    if (tile_state[i] == 2) return true;
}
function isTileCleared(i)
{
    if (tile_state[i] == 0) return true;
}
function checkVictory()
{
    if (cardsRemainedCount < 1)
        debug.innerHTML = " *** YOU ARE VICTORIOUS IN "+click_counter+" TURNS ***";
}



function shuffleArray(arr)
{
    let x = arr.sort( () => Math.random() - 0.5);
    return x;
}
shuffleArray(tiles);
updateCardsView();
//=========================================================
const buttonPressed = e => 
{
    if (accept_clicks)
    {
        click_counter++;
        console.log('step: '+click_counter+' tile: '+e.target.id+' card: '+tiles[e.target.id]);
        //////////////////////////////////
        //// Cleanup
        //////////////////////////////////
        if ( cleanupMatchedTiles )
        {
            clearTile(dump_tile_one);
            clearTile(dump_tile_two);
            dump_tile_one = -1;
            dump_tile_two = -1;
            cleanupMatchedTiles = false;
        }
        if ( resetUnmatchedTiles )
        {
            hideTile(reset_tile_one);
            hideTile(reset_tile_two);
            resetUnmatchedTiles = false;
        }
        //////////////////////////////////////////////////////
        // Clicking on cleared tile
        if (isTileCleared(e.target.id))
        {
            console.log('['+e.target.id+'] = {'+tiles[e.target.id]+'} This tile is cleared, no cards here. Wating...');

            return;
        }

        ///////////////////////////////////////////////////////////////////////////////////
        // Clicking the tile which has already opened card
        if ( isTileOpened(e.target.id))
        {
            console.log('This card is already opened. Waiting...');
            debug.innerHTML = "This card is already opened. Click another one";
            return;
        }

        /////////////////////////////////////////////////
        // Clicking on  closed tile and setting it as primary
        if (primaryCardValue < 1)
        {
            
            primaryCardValue = tiles[e.target.id];
            primaryCardIndex = e.target.id;
            showTile(e.target.id);
            console.log('Opening card and setting '+tiles[e.target.id]+' as a primary card. Waiting...');
            debug.innerHTML = "Opening " + tiles[e.target.id]+" as primary card. Waiting for next turn...";
            return;
        }

        /////////////////////////////////////////////////////////
        // Clicking closed card with another opened card which MATCH
        if (primaryCardValue == tiles[e.target.id])
        {

            showTile(e.target.id);
            let btn = buttons[e.target.id];
            btn.style.color = "greenyellow";
            buttons[e.target.id] = btn; 
            let btn2 = buttons[primaryCardIndex];
            btn2.style.color = "greenyellow";
            buttons[primaryCardIndex] = btn2;
            cardsRemainedCount -= 2;
            


            //Cleanup
            
            dump_tile_one = e.target.id;
            dump_tile_two = primaryCardIndex;

            primaryCardValue = 0;
            primaryCardIndex = -1;
            cleanupMatchedTiles = true;
            //let x = document.getElementById(tiles[e.target.id]);
            //let y = document.getElementById(tiles[primaryCardIndex]);
            
            //x.style.color = "greenyellow";
            //y.style.color = "greenyellow";
           // hideTile(e.target.id);
            //hideTile(primaryCardIndex);
            debug.innerHTML = "MATCH! Click any tile to continue";
            console.log('Match!');
            
            return;
        }


        ////////////////////////////////////////////////////
        // Clicking on a closed card with another opened card which MISMATCH 
        
        if ( isTileClosed(e.target.id) && primaryCardValue != tiles[e.target.id])
        {
            showTile(e.target.id);
            let btn = buttons[e.target.id];
            btn.style.color = "yellow";
            buttons[e.target.id] = btn; 
            let btn2 = buttons[primaryCardIndex];
            btn2.style.color = "yellow";
            buttons[primaryCardIndex] = btn2;
            
            


            //Cleanup
            reset_tile_one = e.target.id;
            reset_tile_two = primaryCardIndex;
            

            primaryCardValue = 0;
            primaryCardIndex = -1;
            resetUnmatchedTiles = true;
            //let x = document.getElementById(tiles[e.target.id]);
            //let y = document.getElementById(tiles[primaryCardIndex]);
            
            //x.style.color = "greenyellow";
            //y.style.color = "greenyellow";
           // hideTile(e.target.id);
            //hideTile(primaryCardIndex);
            console.log('Mismatch! Try again.');
            debug.innerHTML = "Mismatch! Click any tile to continue";
            
            return;
           
        }



        checkVictory();
        result.innerHTML = `Pook pook`;
        //console.log('turn = '+click_counter+'\ntile = '+e.target.id+'\nvalue = '+tiles[e.target.id]+'\nprimaryCardValue = '+primaryCardValue);
       
        /*for ( let i=0; i<100000000;i++)
        {

        }*/
    }
        //alert(tile_state);
       // updateCardsView();
        //console.log('turn = '+click_counter+'\ntile = '+e.target.id+'\nvalue = '+tiles[e.target.id]+'\nprimaryCardValue = '+primaryCardValue);
        
    
}
//==============================================================
start();
function start()
{
    for (let button of buttons) {
    
        button.addEventListener("click", buttonPressed);
        button.innerHTML = tiles[button.id];
        button.style.fontSize=3;
    }
    updateCardsView();
}

function updateCardsView()
{
    for ( let button of buttons)
    {
        /*if (tiles[button.id] < 0 ) button.innerHTML = tiles[button.id];
        if (tiles[button.id] === 0) button.innerHTML = "X";
        if (tiles[button.id] > 0 ) button.innerHTML = tiles[button.id];
        */

        if (tile_state[button.id] == 1) button.innerHTML = tiles[button.id];
        if (tile_state[button.id] == 2) button.innerHTML = "?";
        if (tile_state[button.id] == 0) button.innerHTML = "X";
        button.style.color = "white";


    }
    checkVictory();
}