import React from 'react';
import { textStyles } from '@/styles/tokens';
import { InputBox } from '@/components/common/InputBox';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import Header from '@/components/common/Header';
import { HeaderCategory } from '@/components/common/Header/HeaderCategory';

export default function TokensSample() {
  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className={textStyles['heading-h2']}>Colors</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Swatch name="primary" className="bg-primary text-text-on-primary" />
          <Swatch
            name="primary-tint"
            className="bg-primary-tint text-text-primary"
          />
          <Swatch name="black" className="bg-black text-text-on-primary" />
          <Swatch
            name="surface-white"
            className="bg-surface-white text-text-primary border border-gray-300"
          />
          <Swatch
            name="surface-gray"
            className="bg-surface-gray text-text-primary"
          />
          <Swatch name="gray-100" className="bg-gray-100 text-text-primary" />
          <Swatch name="gray-300" className="bg-gray-300 text-text-primary" />
          <Swatch
            name="gray-500"
            className="bg-gray-500 text-text-on-primary"
          />
          <Swatch
            name="status-error"
            className="bg-status-error text-text-on-primary"
          />
          <Swatch
            name="status-info"
            className="bg-status-info text-text-on-primary"
          />
          <Swatch
            name="status-success"
            className="bg-status-success text-text-on-primary"
          />
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>Text</h2>
        <div className="mt-3 space-y-2">
          <p className="text-text-primary">text-text-primary — 본문 기본</p>
          <p className="text-text-secondary">
            text-text-secondary — 보조 텍스트
          </p>
          <p className="text-text-placeholder">
            text-text-placeholder — placeholder
          </p>
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>Typography Presets</h2>
        <div className="mt-3 space-y-2">
          <p className={textStyles['display-hero']}>display-hero</p>
          <p className={textStyles['heading-h1']}>heading-h1</p>
          <p className={textStyles['heading-h2']}>heading-h2</p>
          <p className={textStyles['heading-h3']}>heading-h3</p>
          <p className={textStyles['body-large']}>body-large</p>
          <p className={textStyles['body-medium']}>body-medium</p>
          <p className={textStyles['body-small']}>body-small</p>
          <p className={textStyles['caption-default']}>caption-default</p>
          <p className={textStyles['footnote']}>footnote</p>
          <p className={textStyles['number-large']}>number-large 1,234</p>
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>InputBox</h2>
        <div className="mt-3 space-y-3">
          <InputBox placeholder="default (stroke gray-500/50)" />
          <InputBox placeholder="strokeNone (배경 70%)" strokeNone />
          <InputBox placeholder="비밀번호" type="password" />
          <InputBox placeholder="가로 꽉 채우기" className="w-full" />
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>Input</h2>
        <div className="mt-3 space-y-4">
          <Input label="닉네임" placeholder="ex) 러닝하는오랑이" />
          <Input label="이메일" placeholder="email@zeph.com" type="email" />
          <Input
            label="비밀번호"
            placeholder="********"
            type="password"
            strokeNone
          />
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>Button</h2>
        <div className="mt-3 space-y-3">
          <Button>다음</Button>
          <Button inactive>다음</Button>
          <Button className="w-full">가로 꽉 채우기</Button>
        </div>
      </section>
      <section>
        <h2 className={textStyles['heading-h2']}>Header</h2>
        <div className="mt-3 space-y-3">
          <div className="rounded-md border border-gray-300">
            <Header variant="back" title="타이틀" />
          </div>
          <div className="rounded-md border border-gray-300">
            <HeaderCategory title="카테고리 추가" />
          </div>
          <div className="rounded-md border border-gray-300">
            <Header
              variant="title"
              title="홈"
              onMenuClick={() => alert('메뉴 클릭')}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className={textStyles['heading-h2']}>Radius</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {(['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map((r) => (
            <div
              key={r}
              className={`flex h-16 w-16 items-center justify-center bg-primary-tint border border-primary text-text-primary rounded-${r}`}
            >
              <span className={textStyles['caption-default']}>{r}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div
      className={`flex h-16 items-center justify-center rounded-md ${className}`}
    >
      <span className={textStyles['caption-medium']}>{name}</span>
    </div>
  );
}
