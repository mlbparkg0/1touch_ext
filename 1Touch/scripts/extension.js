var oneLink=''
var thisid=''

document.addEventListener('DOMContentLoaded', function() {

    var btn_copy = document.getElementById('copy');
    var btn_like = document.getElementById('like');

    btn_copy.addEventListener('click', function () { // copy the link to clipboard
	document.execCommand('copy')
    });

    btn_like.addEventListener('click', function () { // 글 추천
	like()
    });

    var text=''

    // 현재 선택된 탭의 HTML내용을 요청해서 받아온 후 유툽 비디오 링크를 분석
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: 'getHTML'}, function(response) {

	const re = /(iframe)\s+(src).+(youtu).+(iframe)/gi
	const re2 = /(글번호).+(\/em)/
	const re3 = /\d+/

	var text=''
	if (response) {
		text = response.data
	}

	text = text.replace(/iframe/g,'iframe\n')
	thisid = (text.match(re2)+'').match(re3)   // 게시글 아이디

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

function like() { // 추천 ♡♡♡

  const Http = new XMLHttpRequest();
  const url='http://mlbpark.donga.com/mp/action.php?m=like&b=bullpen&id='+thisid;
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange=(e)=>{
      if (Http.readyState == 4 && Http.status == 200)
      {
	var result = Http.responseText
	if (result=='ok') {
    	    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      		chrome.tabs.sendMessage(tabs[0].id, {data: 'refresh'}, function(response) {
      		});
    	    });

	}
        else if ( result == 'nologin' )
        {
                    alert ( ' 로그인 후 이용해주세요. ') ;
                    location.href = "" ;
        }
        else if ( result == 'snslogin' )
        {
                    alert ( ' SNS 가입회원은 사용이 제한됩니다. ') ;
        }
        else if ( result == 'reallogin' )
        {
                    alert ( ' 실명인증 후 이용해주세요. ') ;
        }
        else if ( result == 'duplicate' )
        {
                    alert( ' 이미 추천하셨습니다. ' ) ;
        }
        else if ( result == 'self' )
        {
                    alert ( ' 본인의 글은 추천하실 수 없습니다. ') ;
        }
        else if ( result == 'notfound' )
        {
                    alert ( ' 존재하지 않는 게시물입니다. ') ;
        }
        else if ( result == 'permission' )
        {
                    alert ( ' 권한이 없습니다. ') ;
        }
        else if ( result == 'lowlevel' )
        {
                    alert( ' 회원 가입 후 30일이 지나야 이용가능합니다. ' ) ;
        }
        else
        {
                    alert( ' 오류가 발생하였습니다. 다시 시도해주세요. ' ) ;
        }

      }
  }
}
