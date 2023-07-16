---
title: react query
date: 2023-07-16 10:07:49
category: react
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/76582d94-ca32-41b5-a0aa-5e253eb45231/image.jpg'
draft: false
---

### React query를 쓰는 이유

다른 개발자들과 얘기를 하며, react query를 쓰는게 신세계라는 얘기를 들었는데요!
이걸 한번도 안써봤다니!! 그래서 이번엔 react query에 대해 공부를 하며, 왜 react query를 쓰면 좋은지 정리해보았습니다.

1. `간편한 data fetching`

React query는 원격 API에서 데이터 가져오는 과정을 간소화합니다.

2. `캐싱 및 데이터 동기화`

React query는 자체적으로 캐싱 기능이 있어서 가져온 데이터를 로컬에 저장하고 다른 컴포넌트에 재사용할 수 있습니다.
이런 캐싱 메커니즘은 불필요한 네트워크 요청을 줄여 퍼포먼스를 향상시킬 수 있습니다. 또한 자동적으로 데이터 동기화를 처리하여 캐시를 업데이트하고 일관성있게 유지합니다.

3. `자동 백그라운드 refetching`

react query를 사용하면 백그라운드 데이터 다시 가져오기를 쉽게할 수 있습니다. 다시 말해, 특정 간격을 설정하거나
특정 조건에 따라 다시 가져오기를 트리거할 수 있으므로 명시적인 사용자 작업 없이도 데이터가 항상 최신 상태로 유지됩니다.

4. `Query 무효화, 오래된 데이터 관리` 

React query는 똑똑한 캐시 무효화 매커니즘을 제공합니다. 서버에서 데이터가 변경될 때, react query는 자동적으로
관련된 캐시를 업데이트하고, UI가 최신 데이터를 반영하는지 확인합니다. 또한 오래된 데이터 관리를 지원해서 백그라운드에서 최신 데이터를 
가져오는 동안 캐시된 데이터를 즉시 보여줄 수 있습니다.

5. `Optimistic 업데이트와 변형`

React query는 optimistic update를 제공하여 변형 과정(create,update,delete)을 간소화합니다.
다시 말해, 실제 서버 응답받기 전에 낙관적으로 UI를 업데이트할 수 있는게 가능합니다.

6. `Error handling과 retries`

React query는 광범위한 에러 핸들링 기능을 가지고 있습니다. 오류를 처리하고 재시도할 수 있는 hook을 제공합니다.
retry로직을 커스터마이즈할 수 있고, 에러 바운더리를 구현하여 에러 노티를 쉽게 보여줄 수 있습니다.

7. `React 생태계와의 통합`

React query는 리액트 생태계와 통합이 잘되고, redux 또는 mobX같은 상태 관리 라이브러리와도 호환가능합니다.


예시 코드를 보며 react query를 사용하는 법을 살펴보았습니다.

### useQuery 예시

```js

const userList = () => {

  const { data, isLoading, isError } = useQuery('users', async () => {
    const response = await fetch('https://api.example.com/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching users</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
export default userList;
```

위 코드에서 react query를 사옹할 때, query는 `users`라고 정의했고 이는 `https://api.example.com/users` url에서
유저 리스트를 가져옵니다.<br/>
useQuery는 2개의 arguments를 가지는데 `query key`와 `data를 가져오는 비동기 함수` 입니다.
`query key`는 유니크한 쿼리 식별자이며, react query가 캐싱과 무효화를 관리하는데 도움을 주는 역할을 합니다.
<br/>

query가 진행 중일 때, isLoading flag가 true가 되며, data를 가져올 때 에러가 있으면 isError flag가 true가 됩니다.
query가 성공적으로 데이터를 가져오면 user list를 보여주게 됩니다.

React Query는 가져온 데이터를 캐싱하게 되는데, 만약 컴포넌트가 리렌더를 하면 react query는 캐시를 먼저 확인한 후 캐시된 데이터를 리턴합니다.
만약 데이터가 오래되었거나 만료되었으면 react query는 자동적으로 백그라운드에서 refetch하여 cache와 UI를 업데이트합니다.


### data fetching 시 GET에는 useQuery가 사용되고, PUT,POST,DELETE에는 useMutation이 사용된다.


보통 `useQuery`는 데이터를 가져올 때 씁니다. 보통 HTTP METHOD GET요청처럼 서버에 저장된 상태를 불러와 사용할 떄 사용됩니다.
useQuery를 사용하면 데이터를 가져올 때 자동적으로 캐싱,리프레싱,에러핸들링 같은 것들을 해줍니다.
반면, `useMutation`은 데이터 변형같은 데이터를 추가,업데이트,삭제하는 경우 사용됩니다.
보통 HTTP METHOD POST, PUT, DELETE 요청처럼 서버에 사이드 이펙트를 발생시켜 서버상태를 변경시키는 경우 사용합니다.



### useMutation 예시
```js
 const updateUser = async (userData) => {
    try {
      const response = await axios.put('/api/users', userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  };

  // Use the useMutation hook
  const { mutate, isLoading, isError, error, data } = useMutation(updateUser);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    // Call the mutation function to update user data
    mutate(userData);
  };
```

useMutaion은 useQuery와 비슷한 방식으로 사용될 수 있습니다.
비동기적으로 mutation을 실행하고, 에러핸들링도 합니다.



### 마치며

data fetching도 더 간편하고, 캐싱도 가능한다는 점에서 react query로 변경하는 작업을 해보면 좋을 것 같다는 생각이 들었습니다.
특히, React query가 가지고 있는 기능 중 하나인 optimistic 업데이트를 실제로 활용해보면
너무 좋을 것 같다는 생각이 들어서 이 부분을 좀 더 파고들어봐야할 것 같네요!