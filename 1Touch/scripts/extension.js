var oneLink=''

document.addEventListener('DOMContentLoaded', function() {

    var button = document.getElementById('copy');
    button.addEventListener('click', function () {
	document.execCommand('copy')
    });

    var text=''

    // 현재 선택된 탭의 HTML내용을 요청해서 받아온 후 유툽 비디오 링크를 분석
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: text}, function(response) {

	const re = /(iframe)\s+(src).+(youtu).+(iframe)/gi

	var text=''
	if (response) {
		text = response.data
	}

	text = text.replace(/iframe/g,'iframe\n')

	const matches = text.match(re)
	oneLink=''
	var len = 0

	if (matches==null || matches.length < 0) {
		$('#status').html('동영상을 찾지 못했습니다');
		return
	}
	else {
   		for(var i = 0;i < matches.length;i++){
			// 개별 링크에서 유툽 비디오 아이디 추출
			oneLink += matches[i].substring(matches[i].indexOf('embed')+6, matches[i].indexOf("\"><"))+','
   		}
   		len=i
   		oneLink = oneLink.replace(/,$/,'')
	}
	oneLink = 'https://www.youtube.com/watch_videos?video_ids='+oneLink

	$('#status').html('동영상 갯수: '+len);
	var link = document.getElementById('link')
	link.setAttribute('href', oneLink)
	if (len==0) link.setAttribute('href', 'http://mlbpark.donga.com/mp/')

	var links = document.getElementsByTagName("a");
    	for (var i = 0; i < links.length; i++) {
        	(function () {
	            var ln = links[i];
        	    var location = ln.href;
        	    	ln.onclick = function () {
                		chrome.tabs.create({active: true, url: location});
            		};
	        })();
    	}

       });
   });
});

// 완타치 링크 클립보드로 복사
document.addEventListener('copy', function(e) {
  e.clipboardData.setData('text/plain', oneLink);
  e.preventDefault();
});
