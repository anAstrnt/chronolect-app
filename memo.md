## Recoil install

- npm install recoil
- npm i @types/recoil

## create directory

- /app/components/states

## use Recoil

### one components in one state (string)

```Typescript:avatarState.tsx
import { atom } from "recoil";

export const avatarState=atom<string>({
  key:"avatarState",
  default:"",
})
```

- listed at top level components

```Typescript:page.tsx
  import { RecoilRoot } from "recoil";

function page(){
  return (
   <RecoilRoot></RecoilRoot>
  )
}
```

- fetch default value (string)

`const avatar = useRecoilValue(avatarState);`

- Memoize callback functions

```Typescript:page.tsx
// If you call it the first time, use that state the second time.
  const onChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    setAvatar(e.target.value);
  },[avatar])
```

- fetch setState

`const setAvatar = useSetRecoilState(avatarState);`

- Write in the form of useState

`const [ avatar,setAvatar ] = useRecoilState(avatarState);`

### one components in one state (array)

```Typescript:usersState.tsx
import { atom } from "recoil";

type user={
  id: string;
  name: string;
}

export const usersState=atom<Array<user>>({
  key:"usersState",
  default:[],
})
```

### perform operations on atoms

```Typescript:usersState.tsx
import { atom } from "recoil";

type user={
  id: string;
  name: string;
}

export const usersState=atom<Array<user>>({
  key:"usersState",
  default:[],
})

export const usersStateLength=selector<number>({
  key:"usersStateLength",
  get:({get})=>{
    const usersNumber: Array<user> = get(usersState);
    return usersNumber?.length || 0 ;
  },
})
```
