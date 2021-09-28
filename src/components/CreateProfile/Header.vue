<template>
  <header class="profile-header">
    <h1 class="profile-header__title">
      <slot />
    </h1>
    <slot name="help-text" />
  </header>
</template>

<style lang="scss">
.profile-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @include phone {
    flex-direction: row;
    justify-content: center;
    margin-bottom: 50px;
  }

  @include small-phone {
    margin-bottom: 15px;
  }

  &__title {
    font-weight: $--font-weight-semi-bold;
    font-size: 27px;
    color: var(--primary-text);
    margin-bottom: 20px;

    @include phone {
      font-size: $--font-size-small-subtitle;
      margin-right: 10px;
      margin-bottom: 0;
    }

    @include small-phone {
      font-size: $--font-size-button;
    }
  }
}
</style>
