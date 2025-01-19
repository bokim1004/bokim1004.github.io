---
title: React 19의 새로운 기능
date: 2025-01-19 11:01:51
category: react
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/284332a1-b944-4c07-b588-5beeaee74cb7/image.png'
draft: false
---

2024년 12월 5일, react 19버전이 stable로 올라오게 되었다. 이번 기회에 어떤 내용들이 있는지 간략하게 정리해보고 공부해보면 좋겠다는 생각이 들었다.

### 1. Actions

React 19에서는 비동기 함수와 트랜지션을 활용하여 상태 업데이트를 더욱 간편하게 처리할 수 있는 `Actions`를 도입했다.
이를 통해 pending 상태, 오류 처리, 낙관적 업데이트 등을 자동으로 관리할 수 있게 되었다.

`주요 특징`<br/>
**비동기 함수 지원**: useTransition과 함께 비동기 함수를 사용하여 상태 업데이트를 관리한다. <br/>
**자동 상태 관리**: pending 상태와 오류 처리를 자동으로 수행한다.
<br/>


예를 들어, 유저가 이름을 변경하기 위해 form을 제출할 경우, api요청을 하고 response를 다룬다. 과거에는
pending상태, 에러, optimistic update,순차적 요청 등을 수동으로 처리해야했다.

```js
// Before Actions (공식 문서 예시)
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```
이제 react 19에서는 useTransition을 사용하여 pending상태를 다룰 수 있다.
```js
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

비동기 전환을 사용하는 함수는 "Actions(액션)"이라고 부른다. 
Actions는 데이터를 제출하는 작업을 자동으로 관리한다.

`대기 상태(Pending state)`: Actions는 요청이 시작될 때 대기 상태를 제공하며, 최종 상태 업데이트가 완료되면 자동으로 대기 상태를 초기화한다. <br/>

`낙관적 업데이트(Optimistic updates)`: Actions는 새로운 useOptimistic 훅을 지원하여 요청이 진행 중일 때 사용자에게 즉각적인 피드백을 보여줄 수 있다.<br/>

`오류 처리(Error handling)`: Actions는 오류 처리를 제공하여 요청 실패 시 Error Boundaries를 표시할 수 있으며, 낙관적 업데이트를 원래 값으로 자동 복원한다.<br/>

`폼(Forms)`: form 요소는 이제 action 및 formAction 속성에 함수를 전달할 수 있다. action 속성에 함수를 전달하면 기본적으로 Actions를 사용하며, 제출 후 폼을 자동으로 초기화한다.<br/>


### 2. useActionState
useActionState는 폼 액션의 결과를 기반으로 컴포넌트의 상태를 관리하고 업데이트하는 데 사용된다.<br/>

`주요 기능` <br/>
**상태 관리**: useActionState는 폼이 마지막으로 제출되었을 때 액션 함수가 반환한 값을 상태로 관리한다. 초기 렌더링 시에는 제공된 initialState를 사용하고, 폼 제출 후에는 액션 함수의 반환값으로 상태가 업데이트된다.<br/>

**액션 함수 래핑**: 이 훅은 기존의 폼 액션 함수를 받아 새로운 액션 함수를 반환한다. 이 반환된 함수는 `<form>` 컴포넌트의 action 속성이나 폼 내부의 `<button>` 컴포넌트의 formAction 속성에 전달할 수 있다.<br/>

**대기 상태 관리**: useActionState는 액션 함수가 실행되는 동안 isPending 플래그를 통해 대기 상태를 관리한다. 이를 통해 비동기 작업의 진행 상태를 쉽게 추적할 수 있다.
```js
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```
### 3. useFormStatus 
useFormStatus는 폼 제출 시 해당 폼의 상태 정보를 제공한다.<br/>

`주요 기능` <br/>
pending: 불리언 값으로, true일 경우 상위 `<form>`이 현재 제출 중임을 나타낸다.<br/>
data: FormData 인터페이스를 구현한 객체로, 상위 `<form>`이 제출하는 데이터를 포함한다. 활성화된 제출이 없거나 상위에 `<form>`이 없는 경우에는 null이다.<br/>
method: 'get' 또는 'post' 중 하나의 문자열 값으로, 상위 `<form>`이 사용하는 HTTP 메서드를 나타낸다. 기본적으로 `<form>`은 GET 메서드를 사용하며, method 속성을 통해 지정할 수 있다.<br/>
action: 상위 `<form>`의 action 속성에 전달된 함수의 참조다. 상위 `<form>`이 없는 경우에는 null이다. action 속성에 URI 값이 제공되었거나 action 속성을 지정하지 않았을 경우에는 status.action은 null이다.

```js
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function MyForm() {
  const handleSubmit = async (formData) => {
    // 폼 제출 처리 로직
  };

  return (
    <form action={handleSubmit}>
      <input type="text" name="username" />
      <SubmitButton />
    </form>
  );
}
```

### 4. useOptimistic

useOptimistic는 비동기 작업이 진행되는 동안 사용자 인터페이스(UI)를 낙관적으로 업데이트할 수 있도록 지원한다.<br/>

`주요 기능`<br/>

낙관적 상태 관리: useOptimistic는 현재 상태와 업데이트 함수를 받아, 비동기 작업이 완료되기 전에 예상되는 상태를 UI에 즉시 반영할 수 있게 한다. 이를 통해 사용자에게 더욱 빠르고 반응성 있는 경험을 제공한다. <br/>
```js
// 공식문서 예시 
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

### 5. use
React 19에서는 렌더링 중에 리소스를 읽기 위한 새로운 API인 use를 도입했다. <br/>\
`주요 기능`<br/>
**Promise 처리**: use를 사용하면 Promise를 동기적으로 읽을 수 있으며, React는 해당 Promise가 해결될 때까지 컴포넌트를 일시 중단(Suspend)한다.<br/>

**Context 읽기**: use를 통해 Context를 읽을 수 있으며, 조건문이나 반복문 내에서도 호출이 가능하다. 이는 기존의 useContext 훅과 달리 더 유연한 사용을 지원한다.<br/>
1. promise 사용 <br/>
```js
import { use } from 'react';

function Comments({ commentsPromise }) {
  // `use`는 Promise가 해결될 때까지 일시 중단된다.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({ commentsPromise }) {
  // `use`가 Comments 컴포넌트에서 일시 중단되면,
  // 이 컴포넌트의 Suspense 경계가 표시된다.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}
```
2. context사용
```js
import { use } from 'react';
import ThemeContext from './ThemeContext';

function Heading({ children }) {
  if (children == null) {
    return null;
  }
  // 조건부로 Context를 읽는다. useContext를 사용하지 않아도 됨
  const theme = use(ThemeContext);
  return (
    <h1 style={{ color: theme.color }}>
      {children}
    </h1>
  );
}
```

### 7. 서버 컴포넌트
React 19에서는 서버 컴포넌트(React Server Components) 기능이 도입되었다. 
서버 컴포넌트는 클라이언트 애플리케이션이나 서버 사이드 렌더링(SSR) 서버와는 별도의 환경에서 컴포넌트를 사전에 렌더링할 수 있는 새로운 옵션을 제공한다.
이러한 분리된 환경이 바로 React 서버 컴포넌트에서 말하는 "서버"이다.

`주요 특징` <br/>
**서버에서의 사전 렌더링**: 서버 컴포넌트는 빌드 시 CI 서버에서 한 번 실행되거나, 각 요청마다 웹 서버를 통해 실행될 수 있다. 이를 통해 클라이언트로 전송되는 JavaScript 번들의 크기를 줄여 초기 로딩 속도를 향상시킨다.<br/>

**서버 리소스에 직접 접근**: 서버 컴포넌트는 서버에서 실행되므로 데이터베이스, 파일 시스템 등 서버 전용 리소스에 직접 접근할 수 있다. 이를 통해 클라이언트에서 불필요한 네트워크 요청을 줄이고 성능을 최적화할 수 있다.<br/>

**클라이언트 부하 감소**: 서버에서 비즈니스 로직과 데이터 처리를 수행하고, 클라이언트는 UI 렌더링에 집중함으로써 브라우저의 부담을 줄일 수 있다.

```js
// 서버 컴포넌트 예시
import * as db from './db.ts';
import { createOrg } from './org-actions.ts';
import { OrgPicker } from './org-picker.tsx';

// 서버에서 데이터베이스 접근 및 조직 생성 등의 로직을 처리
```
서버 컴포넌트는 특히 대규모 애플리케이션에서 사용자가 페이지를 로드할 때마다 서버와 클라이언트 간의 최적의 데이터 처리 방식을 찾는 데 유용하다.

### 마치며
react 19에 추가된 새로운 기능들을 살펴보았다. 계속해서 발전하는 react를 잘 따라잡기 위해서는 꾸준한 공부가 정말 필수인 것 같다.
여러 기능들 중에 특히 사용해보고 싶은 것은 서버 컴포넌트다. <br/>
db조회나 api호출을 서버 컴포넌트를 통해 해서 클라이언트 번들 크기를 줄이고 초기 로딩 속도 향상에 도움을 줄 것 같다.
새로운 기능들이 추가되는데 생각보다 몰라서 사용하지 못하는 경우들이 많은 것 같다. 그래서 열심히 주시하고 있어야겠다.

### 참고
- https://react.dev/blog/2024/12/05/react-19
- https://medium.com/@zero86/react-react-19-%EA%B8%B0%EB%8A%A5-%EB%8B%A4%EC%8B%9C-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0-11fe39e39b7d
- https://mycodings.fly.dev/blog/2024-09-21-react-19-cheat-sheet-1-server-component-actions?utm_source=chatgpt.com