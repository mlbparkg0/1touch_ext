chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
// 현재 선택된 탭의 HTML내용을 되돌려 보내줌
    if (request.data=='getHTML') {
    	var text = document.documentElement.innerHTML
    	sendResponse({data: text, success: true});
    }
    if (request.data=='refresh') {

	refresh();

    }

});

function refresh() {

	var likecnt = eval(document.getElementById("likeCnt").innerText)+1
	document.getElementById("likeCnt").innerText=likecnt

    //chrome.tabs.getSelected(null, function(tab) {
  	//var code = 'window.location.reload();';
  	//chrome.tabs.executeScript(tab.id, {code: code});
    //});
}
