---
title: 항해플러스 프론트엔드 5기 5주차 회고
date: 2025-04-27 15:04:92
category: etc
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/db477a29-3257-42ee-b936-58629e0ef09f/image.png"
---

<p>
<img src="https://velog.velcdn.com/images/chloeee/post/db477a29-3257-42ee-b936-58629e0ef09f/image.png" width="500px" >
</p>

## 들어가며

5주차 과제는 클린코드로 리팩토링하는 것이 필요했는데 계층을 이해하고 분리하여 정리정돈을 하는 기준이나 방법등을 습득하는 것이 목표였다.
기본과제, 심화과제의 요구사항을 분석하며 어떤식으로 개발할지 초반에 정리하는 시간을 먼저 가졌다.
과제의 핵심취지를 분석한 후, 계층을 이해하며 개발해야함을 알고 이번 과제의 개발 방향을 세웠다.
엔티티 개념이 익숙하지 않아서, 이것에 대해 찾아보고 어떻게 엔티티를 나눌 것인지 찾아보고 고민했다.

## 과제를 하며 가장 신경쓴 부분

`계층구조 고려하여 개발하기`

실무에서 개발을 했을 때는 계층 구조를 따져서 개발하기보다는, 복잡한 컴포넌트는 쪼개고, 뷰 로직과 비즈니스 로직을 분리하는 정도만 했었다.

이번 과제를 진행하면서, 계층별로 설계를 먼저 하고 그에 맞게 개발을 진행했다.
"안정적이고 변하지 않는 뼈대부터 다듬자" 는 마음으로 아래의 순서대로 개발을 진행했다.

```text
1. entities 폴더 만들고 도메인 객체 타입화하기
2. calculation폴더 만들고 계산함수 순수화
3. store설계 - 상태를 모듈별로 나눔
- 상태만 가지고 있고 로직은 훅/계산으로 분리
4. 로직 정리 - HOOKS
5. 화면 구성 features
6. 공통컴포넌트 분리 UI
7. page 분리
   ```

이와 같이 계층별로 순차적으로 개발을 하다 보니, 안정적인 프로젝트 기반을 쌓는 느낌이었다.
이렇게 진행하니 전체적인 흐름을 명확히 파악할 수 있었고, 더 효율적으로 개발할 수 있었다. 만약 계층 구조를 고려하지 않고 개발을 했다면, 여기저기 왔다 갔다 하면서 시간을 비효율적으로 사용했을 것이라는 생각이 들었다.
특히, 엔티티별로 구분하는 방식은 처음 시도해봤는데, 로직, 훅, 기능 폴더 내의 코드를 `coupon, discount, product, cart`와 같은 엔티티별로 나누니, 코드 수정이나 리팩토링 시 매우 편리하다는 생각이 들었다. 어디에 코드가 있는지 예측이 쉬워져서, 리팩토링 시 훨씬 효율적이라는 점을 확실히 느꼈다.

```text
엔티티란? 고유한 ID(식별자)를 가진, 바뀔 수 있는 데이터를 가진 객체라고 하는데 기획이 바뀌어도 변하지 않을 데이터라고 보면 될 것 같다. 보통 api를 보고 나눌 수 있다는 이야기를 들었다.
```

폴더 구조를 나눌 때도 아래와 같이 계층 구조를 고려하여 나누려고 했다. 특히 엔티티별로 신경써서 features,hooks을 나누고 개발을 진행했었다.

## 계층별로 나눈 폴더구조

### Folder Structure 📁

 **🔧 refactoring** 폴더

- **💡 calculations** - 순수 계산 함수
  - `apply-coupon.ts`
  - `calc-discount-rate.ts`
  - `calc-total-discount.ts`
  
- **🧩 components** - UI 레이아웃
  - `layout.ts`

- **📊 data** - 초기 데이터
  - `index.ts`
  - `initialCoupons.ts`
  - `initialProducts.ts`

- **🏷️ entities** - 도메인 객체 및 도메인 컴포넌트
  - **🛒 cart** - 장바구니
    - `cartItem.ts`
  - **🎟️ coupon** - 쿠폰
    - `coupon-input-form.ts`
    - `coupon.ts`
  - **💸 discount** - 할인
    - `discount-input-form.ts`
    - `discount.ts`
  - **📦 product** - 상품
    - `product.ts`

- **⚙️ features** - 사용자 및 관리자 기능으로 분리
  - **👨‍💻 admin** - 관리자 페이지
  
    - **🎟️ coupon** - 쿠폰
      - `coupon-manage-section.ts`

    - **💸 discount** - 할인
      - `discount-edit-form.ts`

    - **📦 product** - 상품
      - `new-product-form.ts`
      - `product-edit-form.ts`
      - `product-item.ts`
      - `product-list.ts`
      - `product-manage-section.ts`

  - **👤 user** - 사용자 페이지 (장바구니 페이지)
    - **🛒 cart** - 장바구니
      - `cart-list.tsx`
      - `cart-price-summary.tsx`
      - `cart-section.tsx`
    - **🎟️ coupon** - 쿠폰 관련
      - `coupon-section.tsx`
    - **📦 product** - 상품 관련
      - `product-section.tsx`

- **🎣 hooks** - 로직 hook으로 분리
  - **🛒 cart** - 장바구니
    - `useCart.ts`
  - **🎟️ coupon** - 쿠폰 관련
    - `useCoupons.ts`
    - `useSelectedCoupon.ts`

  - **💸 discount** - 할인
    - `useDiscount.ts`
    - `useDiscountCalculator.ts`

  - **📦 product** 상품
    - `useEditProductAction.ts`
    - `useProduct.ts`
  - **shared**  재사용 가능한 hook
    - `useToggle.ts`

- **🧠 logic** - 비즈니스 로직
  - **🛒 cart** - 장바구니
    - `cart-logic.ts`
  - **📦 product** 상품
    - `product-logic.ts`

- **📑 pages** - 페이지 컴포넌트
  - `AdminPage.tsx`
  - `CartPage.tsx`

- **🗄️ store** - 상태 관리 스토어
  - `cart-store.ts`  장바구니 관련 상태
  - `product-store.ts` 상품 관련 상태

- **💻 ui** - UI 구성 요소 - 재사용 가능한 UI
  - `button.tsx`
  - `card-with-title.tsx`
  - `form-input.tsx`
  - `input.tsx`
  - `list-wrapper.tsx`
  
- **⚙️ utils** - 유틸리티 함수들
  - `formatter.ts`
  - `percentUtils.ts`

계층구조를 고려하여 단계별로 개발을 하다보니, `데이터의 흐름`도 더 파악이 쉽다는 생각이 들었다.

## 과제를 해보며 느낀 아쉬운 점?

Hook 폴더에서 엔티티별로 훅을 나누긴 했지만, 돌아보면 조금 더 세분화할 수 있지 않았을까 하는 생각이 들었다.
명확한 기준을 가지고 역할에 따라 훅을 쪼개고 정리했더라면, 유지보수나 확장성 측면에서도 더 좋았을 것 같다.

또한, 시간이 조금 더 있었다면 컴포넌트도 더 잘게 나눠서 역할별로 명확하게 구분했으면 좋았을 것 같다는 아쉬움도 있었다.
전체적으로 기능 단위로 분리하긴 했지만, UI 재사용성과 가독성 측면에서 더 다듬을 수 있었겠다는 생각이 들었다.

## 마치며

무작정 개발에 들어가기보다는 과제 시작 전에 과제의 취지는 무엇이고 목표는 무엇인지 분석하고 들어가니 개발 방향성이 잘 잡혀서 좋았던 과제였다. (진작 이렇게 할걸^^,,)
나는 계층 순서대로 아래에서부터 위로 올라가는 방향으로 뼈대를 잡아간다는 느낌으로 해봤는데 이렇게 하니 시간도 효율적으로 개발할 수 있었던게 좋았다.
데이터의 흐름을 단방향으로 볼 수 있게 개발을 할 수 있어서 복잡성이 확실히 줄어들었다고 느껴졌다.<br/>
이번 과제에서 처음으로 BP(best practice)로 선정이 되었다..!
<p>
<img src="https://velog.velcdn.com/images/chloeee/post/a5ab161a-c48d-43a3-b03e-4e89e6cf14a7/image.png" width="600px" >
</p>
테오 코치는 아래와 같은 리뷰를 주셨다.

<p>
<img src="https://velog.velcdn.com/images/chloeee/post/43389ccc-e252-44ea-929a-ff3d380acd3a/image.png" width="600px" >
</p>

코치님의 리뷰를 보고 단방향의 흐름이 있는 다양한 계층이 있다는 것을 다시 한번 이해하고, 너무 많은 계층으로 나누기 보다는 적절한 단위로 개발을 해봐야겠다는 생각을 다시 했다.
6주차 과제는 클린코드 마지막이다...!
5주차에서 잘한 것은 적용하고 부족하다고 느꼈던 것은 보완해가며 마무리 잘해봐야겠다!
