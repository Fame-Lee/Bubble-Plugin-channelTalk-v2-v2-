function(instance, properties, context) {
    console.log('채널톡 부팅 시작');
    
    // 버블의 boolean 값 처리
    const hideButton = properties.hideChannelButton === 'yes' || properties.hideChannelButton === true;
    
    console.log('hideChannelButton 원본 값:', properties.hideChannelButton);
    console.log('hideButton 변환 값:', hideButton);
    console.log('hideChannelButtonOnBoot에 전달할 값:', hideButton);
    
    ChannelIO('boot', {
      "pluginKey": context.keys["pluginKey"], // 플러그인 키
      "memberId": properties.memberId,       // 사용자 ID
      "profile": {                           // 사용자 프로필 정보
        "name": properties.name,             // 사용자 이름
        "email": properties.email,           // 사용자 이메일
        "mobileNumber": properties.mobileNumber, // 사용자 모바일 번호
        "landlineNumber": properties.landlineNumber // 사용자 유선 번호  
      },
      "hideChannelButtonOnBoot": hideButton // 채널톡 버튼 숨김 여부
    });
    
    console.log('채널톡 부팅 완료');
    
    
    // 사용자 정보를 Bubble에 발행 (다른 액션에서 사용할 수 있도록)
    instance.publishState('userName', properties.name);
    instance.publishState('userEmail', properties.email);
    
    ChannelIO('onShowMessenger', function() {
        console.log('ChannelTalk messenger opened');
        instance.triggerEvent('onShowMessenger');
    });
    
    // 사용자가 프로필(이메일 등)을 변경했을 때 콜백
    ChannelIO('onFollowUpChanged', function onFollowUpChanged(profile) {
        console.log('사용자 프로필 변경됨:', profile);
        
        
        // 변경된 이메일을 Bubble에 발행
        if (profile.email) {
            console.log('새로운 이메일:', profile.email);
            instance.publishState('userEmail', profile.email);
            instance.triggerEvent('entereamil');
        }
        
    });
      
  }