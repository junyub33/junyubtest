<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>

<script type="text/javascript">

	var count =0;

	function idCheck(){
		
		var text = $("#member_id").val();
		
        var regexp = /[0-9a-zA-Z]/; // 숫자,영문,특수문자
        // var regexp = /[0-9]/; // 숫자만
//         var regexp = /[a-zA-Z]/; // 영문만
        
        for(var i=0; i<text.length; i++){
            if(text.charAt(i) != " " && regexp.test(text.charAt(i)) == false ){
				alert("한글이나 특수문자는 입력불가능 합니다.");
				return false;
			}
        }
        
        overlapCheck();
        
        
	}
	
	function overlapCheck(){
		
		var param = "member_id" + "=" + $("#member_id").val();
		if($("#member_id").val() == '' || $("#member_id").val()==null)
		{
			alert("아이디를 입력하세요");
			return false;
		}
		
		$.ajax({
			url : "/overlaptest.do",
			type : "GET",
			data : param,
			cache : false,
			async : false,
			dataType : "text",

			success : function(response) {				
				if(response=='0')
				{
					count = 1;
					alert("아이디가 중복이 되지 않습니다. 쓰셔도 됩니다.")
					
				}
				else
				{
					alert("아이디가 중복이 됩니다. 다시 입력 해주세요");
					return false;
				}	
			},
			error : function(request, status, error) {
				if (request.status != '0') {
					alert("code : " + request.status + "\r\nmessage : "
							+ request.reponseText + "\r\nerror : " + error);
				}
			}


		});
	}

	function formCheck() {
		var member_id = document.getElementById('member_id');
		var password = document.getElementById('password');
		var password_hint = document.getElementById('password_hint');
		var password_check = document.getElementById('password_check');
		var hp1 = document.getElementById('hp1'); 
		var hp2 = document.getElementById('hp2'); 
		var hp3 = document.getElementById('hp3'); 
		var hp = hp1.value + "-" + hp2.value + "-" + hp3.value;
		
		/*핸드폰 번호 길이 체크*/
		
		
		if (member_id.value == '' || member_id.value == null) {
			alert('ID를 입력하세요');
			focus.member_id;
			return false;
		}

		if (password.value == '' || password.value == null) {
			alert('비밀번호를 입력하세요');
			focus.password;
			return false;
		}
		
		if (password_check.value == '' || password_check.value == null) {
			alert('비밀번호확인란을 입력하세요');
			focus.password_hint;
			return false;
		}
		
		/*비밀번호와 비밀번호확인란 같은지 확인*/
		if (password.value != password_check.value){
			alert("비밀번호와 비밀번호 확인란이 다릅니다.");
			focus.passowrd;
			return false;
		}
		
		if (password_hint.value == '' || password_hint.value == null) {
			alert('비밀번호힌트를 입력하세요');
			focus.password_hint;
			return false;
		}
		
 		/*핸드폰 번호 길이 체크*/
		if(hp2.value.length<=2 || hp3.value.length!=4){
			alert("휴대폰번호를 제대로 입력해주세요");
			focus.hp2;
			return false;
		}
 		/*핸드폰이 숫자만 들어가는지 체크*/
 		if(isNaN(hp2.value) || isNaN(hp3.value))
		{
			alert("휴대폰번호는 숫자만 들어갈 수 있습니다.");
			return false;
		}
 		/**/
		if (hp2.value.length > 2 || hp3.value.length==4){
			document.getElementById("member_HP").value = hp;
		}
		
		if(count == 0)
		{
			alert("중복확인을 눌러주세요");
			return false;
		}
		
		else{
			save();
		}
		
	}
	
	
	function init(){
		count=0;
	}
	
	function save() {
// 		alert($("#password_hint").val());
// 		alert($("#member_HP").val());
		var str3 = document.getElementById('join');
		str3.submit();
		alert("가입이 완료되었습니다.")
	}
	
	function countCheck(){
		if(count==1){
			count=0;
		}
	}
</script>


<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>회원가입</title>
</head>
<body bgcolor="#ffffff" text="#000000">
	<P align="center">
		<FONT size="6"><B>회원 가입서</B></FONT>
	</P>


	<form action="/members.do" method="post" id="join">
		<table width="550" align="center" border="1" bordercolor="ADD8E6"
			cellpadding="5">
			<tr>
				<td height="30" align="center" bgcolor="#FFDEAD">아이디</td>
				<td bgcolor="#E0FFFF"><input type="text" size="10" id="member_id" name="member_id" maxlength="10" onkeydown="countCheck();" onkeypress="countCheck();">&nbsp;<input type="button" value="중복확인" onclick='idCheck()'></td>
			</tr>
			<tr>
				<td height="30" align="center" bgcolor="#FFDEAD">비밀번호</td>
				<td bgcolor="#E0FFFF"><input type="password" id="password" name="member_password" size=12 maxlength="12"></td>
			</tr>
			<tr>
				<td height="30" align="center" bgcolor="#FFDEAD">비밀번호확인</td>
				<td bgcolor="#E0FFFF"><input type="password" id="password_check" name="password_check" size=12 maxlength="12"></td>
			</tr>
			<tr>
				<td height="30" align="center" bgcolor="#FFDEAD">비밀번호힌트</td>
				<td bgcolor="#E0FFFF"><input type="text" id="password_hint" name="password_hint" size=12 maxlength="12"></td>
			</tr>
			<tr>
				<td rowspan="2" height="30" align="center" bgcolor="#FFDEAD">연락처</td>
				<td bgcolor="#E0FFFF">
					<select id="hp1" name="hp1" style="width:70;">
					   <option value="010"  selected> 010 </option>
					   <option value="011"> 011 </option>
					   <option value="016"> 016 </option>
					   <option value="017"> 017 </option>
					   <option value="018"> 018 </option>
					   <option value="019"> 019 </option>
					</select>
					-
					<input type="text" id="hp2" name="hp2" size="4" maxlength="4">
					-
					<input type="text" id="hp3" name="hp3" size="4" maxlength="4">
					<input type="hidden" id="member_HP" name="member_HP" >
				</td>
			</tr>
			<tr>
				<td colspan="2" height="30" align="center" bgcolor="#FFDEAD">
				<input type="button" id="join" name="join" value="가입하기" onclick="javascript:formCheck();">&nbsp;&nbsp; <input type="reset" value="리셋하기" onclick='init()'>
				<input type="button" id="back" value="뒤로가기" onclick="javascript:location.href='/loginpage.do';"></td>
			</tr>
		</table>
	</form>
</body>
</html>