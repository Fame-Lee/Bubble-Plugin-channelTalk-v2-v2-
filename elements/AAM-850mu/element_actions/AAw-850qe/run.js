function(instance, properties, context) {
    console.log('=== SDK 방식: 프로필 업데이트 액션 ===');
    
    // memberId 우선순위: properties > published state > 기본값
    const memberId = properties.memberId || instance.publishedStates?.memberId || 'anonymous';
    console.log('사용할 memberId:', memberId);
    
    // 텍스트를 배열로 변환하고 중복 항목 그룹핑하는 함수
    function formatItem(item) {
        if (!item) return null;
        
        console.log('받은 데이터:', item, 'typeof:', typeof item);
        
        let items = [];
        
        // 문자열인 경우 - 구분자로 분리해서 배열 생성
        if (typeof item === 'string') {
            const trimmed = item.trim();
            if (!trimmed) return null;
            
            // 파이프(|)로 구분된 경우
            if (trimmed.includes('|')) {
                items = trimmed.split('|').map(str => str.trim()).filter(str => str !== '');
            }
            // 쉼표(,)로 구분된 경우  
            else if (trimmed.includes(',')) {
                items = trimmed.split(',').map(str => str.trim()).filter(str => str !== '');
            }
            // 세미콜론(;)으로 구분된 경우
            else if (trimmed.includes(';')) {
                items = trimmed.split(';').map(str => str.trim()).filter(str => str !== '');
            }
            // 단일 문자열인 경우
            else {
                items = [trimmed];
            }
        }
        // 배열인 경우
        else if (Array.isArray(item)) {
            items = item.filter(str => str && str.toString().trim() !== '').map(str => str.toString().trim());
        }
        // 숫자인 경우
        else if (typeof item === 'number') {
            items = [item.toString()];
        }
        // 그 외의 경우
        else {
            console.log('처리할 수 없는 데이터 타입:', typeof item);
            return null;
        }
        
        // 중복 항목 그룹핑 및 수량 합계
        const groupedItems = {};
        
        items.forEach(itemStr => {
            // "상품명 : 수량" 형태 파싱
            if (itemStr.includes(' : ')) {
                const parts = itemStr.split(' : ');
                if (parts.length >= 2) {
                    const itemName = parts[0].trim();
                    const quantity = parseInt(parts[1].trim()) || 1;
                    
                    if (groupedItems[itemName]) {
                        groupedItems[itemName] += quantity;
                    } else {
                        groupedItems[itemName] = quantity;
                    }
                }
            } else {
                // 수량 정보가 없는 경우 개수 1로 처리
                if (groupedItems[itemStr]) {
                    groupedItems[itemStr] += 1;
                } else {
                    groupedItems[itemStr] = 1;
                }
            }
        });
        
        // 그룹핑된 결과를 배열로 변환
        const result = Object.keys(groupedItems).map(itemName => {
            return `${itemName} : ${groupedItems[itemName]}`;
        });
        
        console.log('그룹핑 결과:', result);
        return result.length > 0 ? result : null;
    }
    
    console.log('properties.addvar1:', properties.addvar1);
    console.log('properties.addvar2:', properties.addvar2);
    console.log('properties.addvar3:', properties.addvar3);
    console.log('properties.addvar4:', properties.addvar4);
    console.log('addvar5:', properties.addvar5);
    console.log('addvar6:', properties.addvar6);
    console.log('addvar7:', properties.addvar7);
    
    if (typeof ChannelIO !== 'undefined') {
        const profileData = {};
        
        // 각 addvar를 개별적으로 처리
        const addvar1Data = formatItem(properties.addvar1);
        console.log('addvar1Data 결과:', addvar1Data);
        if (addvar1Data) {
            profileData["addvar1"] = addvar1Data; // addvar1 리스트
        }
        
        const addvar2Data = formatItem(properties.addvar2);
        if (addvar2Data) {
            profileData["addvar2"] = addvar2Data; // addvar2 리스트
        }
        
        const addvar3Data = formatItem(properties.addvar3);
        if (addvar3Data) {
            profileData["addvar3"] = addvar3Data; // addvar3 리스트
        }
        
        const addvar4Data = formatItem(properties.addvar4);
        if (addvar4Data) {
            profileData["addvar4"] = addvar4Data; // addvar4 리스트
        }
        
        if (properties.addvar5 !== null && properties.addvar5 !== undefined) {
            profileData["addvar5"] = properties.addvar5; // 원본 타입으로 전송
        }
        
        if (properties.addvar6 !== null && properties.addvar6 !== undefined) {
            profileData["addvar6"] = properties.addvar6; // addvar6 숫자
        }
        
        if (properties.addvar7 !== null && properties.addvar7 !== undefined) {
            profileData["addvar7"] = properties.addvar7; // addvar7 숫자
        }
        
        profileData["lastUpdated"] = new Date().toISOString();
        profileData["memberId"] = memberId; // memberId도 프로필에 포함
        
        try {
            ChannelIO('updateUser', {
                profile: profileData
            }, function onUpdateUser(error, user) {
                if (error) {
                    console.error('프로필 업데이트 실패:', error);
                } else {
                    console.log('프로필 업데이트 성공:', user);
                }
            });
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
        }
        
        console.log('SDK 프로필 업데이트 완료:', profileData);
        
    } else {
        console.error('ChannelIO SDK가 로드되지 않음');
    }
}