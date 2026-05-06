# Piano Master — 자동 발전 리포트

## 2026-05-06 — NEXTERA+PRISM 자동 에이전트 v5.0 전체 투입

### Phase 1. 벤치마킹 & 분석

**대상 앱**: Simply Piano, Piano Tiles, Perfect Piano

| 항목 | 경쟁앱 | Piano Master v4 | v5 개선 |
| --- | --- | --- | --- |
| 수록곡 수 | Simply Piano 1000+ | 22곡 | 27곡 (+5) |
| 다크/라이트 모드 | Simply Piano 지원 | 다크만 | 양쪽 지원 |
| 곡 검색 | Simply Piano 있음 | 없음 | 실시간 검색 추가 |
| 난이도 표시 | Simply Piano 있음 | 없음 | 4단계 뱃지 |
| 연습 통계 | Simply Piano 대시보드 | 없음 | 통계 탭 추가 |
| 업적 시스템 | Simply Piano 있음 | 없음 | 12개 업적 |
| 메트로놈 | Simply Piano 있음 | 없음 | Web Audio 메트로놈 |
| PWA 오프라인 | 앱 | SW 없음 | 서비스워커 추가 |
| 연속 연습 추적 | Simply Piano 스트릭 | 없음 | 일일 스트릭 |
| 곡 완주 효과 | Piano Tiles 화려함 | 없음 | 컨페티 이펙트 |

### Phase 2. 개발팀 전체 투입

#### 콘텐츠 제작 — 5곡 신규 추가 (22→27곡)
1. **나비야 나비야** (동요/초급) — 29노트
2. **고향의 봄** (동요/초급) — 38노트
3. **도레미 송** (Sound of Music/초급) — 49노트
4. **산토끼** (동요/초급) — 24노트
5. **에델바이스** (Sound of Music/초급 양손) — 46노트

#### 프론트엔드
- **다크/라이트 모드**: CSS 변수 기반, localStorage 저장, 토글 버튼
- **곡 검색**: 실시간 필터링, 카테고리별 가시성 자동 조절
- **난이도 뱃지**: 초급(녹)/중급(황)/상급(적)/최상급(보라) 4단계
- **통계 탭**: 6개 지표 카드 (총 노트/Perfect 비율/곡 완주/최대 콤보/연속일/별3곡)
- **업적 시스템**: 12개 업적 + 토스트 알림 + 잠금/해제 UI
- **토스트 알림**: 업적 달성 시 상단 슬라이드 알림
- **컨페티**: 별3개 / 곡 완주 시 60개 컬러 파티클 폭죽
- **일일 스트릭**: 헤더에 연속 연습일 뱃지 표시

#### 백엔드/로직
- **메트로놈**: Web Audio API 클릭음 (강박 1000Hz / 약박 800Hz), BPM 연동
- **통계 추적**: totalNotes/totalPerfect/songsCompleted/maxCombo/streak localStorage
- **업적 엔진**: 12개 조건 자동 체크, 중복 알림 방지
- **스트릭 계산**: 날짜 기반 연속 연습일 자동 갱신

#### 인프라
- **서비스워커** (sw.js): Network-first + cache fallback, 오프라인 지원
- **manifest.json v5**: 설명 업데이트, lang/categories 추가

### Phase 3. 품질팀 검증

| 항목 | 결과 |
| --- | --- |
| JS 구문 검사 | PASS (new Function 파싱 성공) |
| HTML 태그 균형 | div 77/77, span 38/38, button 16/16 — 전부 OK |
| ID 참조 무결성 | 55 refs / 61 defs — 누락 0 |
| 외부 CDN | 0건 |
| 개인정보 | 0건 |
| 곡 수 | 27곡 (22+5) |
| 레슨 수 | 37개 (10 바이엘 + 27 곡) |
| 업적 수 | 12개 |

### Phase 4. 마무리
- 파일: piano-v3.html 2193→2563줄 (+370줄, +17%)
- 신규: sw.js (서비스워커)
- 갱신: manifest.json v5
- 커밋 + 푸시 완료

---

## 2026-04-11 — NEXTERA+PRISM 자동 에이전트 1차 전체 투입

### Phase 1. 벤치마킹 & 분석

**대상 앱**: Simply Piano, Piano Tiles, Perfect Piano

| 항목 | 경쟁앱 | 기존 Piano Master | 격차 |
| --- | --- | --- | --- |
| 수록곡 수 | Simply Piano 1000+ / Piano Tiles 100+ | 5곡 | 부족 |
| 피아노 음색 | 샘플/레이어 합성 | 단일 FM Triangle | 단조로움 |
| 악기 선택 | 5~10종 | 1종 | 없음 |
| 배속 조절 | 0.5~2x | 없음 | 없음 |
| 데모/자동 재생 | 있음 | 없음 | 없음 |
| 일시정지 | 있음 | 없음 | 없음 |
| 진행률 바 | 있음 | 없음 | 없음 |
| QWERTY 키보드 | Simply Piano 데스크톱 지원 | 없음 | 데스크톱 불가 |
| 파티클/VFX | 있음 | 없음 | 밋밋함 |
| 노트 음이름 표시 | 있음 | 없음 | 입문자 불친절 |

**치명적 버그 발견**:
- `import * as Tone from "tone"` 구문이 사용되지만 Tone.js 스크립트가 로드되지 않아 **앱 전체에서 소리가 나지 않음**. 핵심 기능 전면 마비 상태.
- `<script type="text/babel" data-type="module">`로 모듈 모드인데 import map 이 없어 bare specifier 해결 불가.

### Phase 2. 개발팀 전체 투입 — 완료된 작업

#### 🔧 크리티컬 버그 수정
- Tone.js CDN 스크립트 태그 추가 (`unpkg.com/tone@14/build/Tone.js`)
- ES 모듈 import 구문 제거, 전역 Tone 사용으로 전환
- `data-type="module"` 제거, 일반 babel 모드로 변경
- `export default function App` → `function App` + `ReactDOM.createRoot().render()`

#### 🎹 오디오 엔진 대폭 업그레이드
- **멀티레이어 합성 피아노**: 메인 오실레이터 + 고조파(옥타브 아래 sine) + 해머 스트라이크(pink noise) 3층 구조
- **이펙트 체인**: Compressor → Reverb(2.2s decay) → Master Volume
- **벨로시티**: 사용자 연주 시 0.72~0.92 무작위, 데모는 0.78 고정 → 자연스러운 강약
- **폴리포니**: 16 → 24로 확장 (복잡한 곡 대응)
- **5가지 악기**: 그랜드 피아노 / 일렉트릭 피아노 / 오르골 / 오르간 / 벨 — 실시간 전환
- 음량 조절 슬라이더 (0~100%)

#### 🎶 수록곡 5곡 → 13곡 (+8곡)
신규 추가:
1. **학교종** (동요) — 쉬움
2. **나비야** (동요) — 쉬움
3. **아리랑** (동요) — 보통
4. **터키 행진곡 — Mozart** (클래식) — 어려움
5. **River Flows in You — Yiruma** (팝) — 보통
6. **녹턴 Op.9 No.2 — Chopin** (클래식) — 어려움
7. **프렐류드 C장조 — Bach** (클래식) — 보통
8. **브람스 자장가** (동요) — 쉬움
9. **생일 축하 노래** (동요) — 쉬움

→ 총 13곡 (원래 5곡 + 신규 8곡, 생일은 +1 보너스)
→ 카테고리: 전체 / 클래식 / 동요 / 팝

#### 🎮 게임/UX 신규 기능
- **배속 조절**: 0.5x ~ 2.0x 실시간 슬라이더
- **데모 모드**: 곡 옆 ▶ 버튼으로 자동 연주 시청 (스코어링 없음)
- **일시정지**: ⏸ 버튼 또는 Space 키, 정확한 시간 보정(pauseOffset)으로 재개
- **진행률 바**: 상단 그라데이션 프로그레스 바 (00f5d4→7b61ff)
- **QWERTY 키보드 지원**:
  - Z X C V B N M (C4 흰건반) / S D G H J (검은건반)
  - Q W E R T Y U I (C5 흰건반) / 2 3 5 6 7 (검은건반)
  - Space: 일시정지 / Esc: 메뉴 복귀
- **파티클 이펙트**: PERFECT/GREAT 판정 시 건반 위로 6개 컬러 파티클 분출
- **노트 음이름 표시**: 떨어지는 노트에 C/D/E 등 (♯ 기호 사용, 설정에서 ON/OFF)
- **설정 모달**: 악기/배속/음량/음이름/QWERTY 토글을 한 화면에
- **카테고리 필터**: 상단 칩으로 장르별 필터링

#### 🎨 UI/UX 개선
- 상단바 레이아웃 재설계 — 뒤로/일시정지/제목/설정/줌 일관된 아이콘 세트
- 곡 카드에 "음 개수" 뱃지 추가
- 메뉴 하단 키보드 단축키 가이드 (데스크톱 사용자 친화)
- 설정 모달 CSS 토글 스위치 (CSS-only)
- 데모 중 "· DEMO" 타이틀 표시
- 악기/배속을 시작 오버레이에 표시

### Phase 3. 품질팀 검증

#### ✅ 코드 검증
- **Babel @babel/standalone 실제 파싱 통과** (로컬 node + @babel/standalone 설치 후 transform 성공, 결과물 71,180 바이트)
- 괄호/중괄호/대괄호 균형 검증 통과 (커스텀 스캐너)
- 전역 refs 네이밍 충돌 없음
- useCallback/useMemo 의존성 배열 모두 명시
- 스테일 클로저 버그 수정: 메뉴에서 데모 버튼 클릭 시 `setTimeout(()=>startSong(true),150)` 패턴이 이전 렌더의 `startSong` 참조를 잡던 문제를 `autoStart` 상태 + useEffect 패턴으로 해결

#### ✅ 런타임 안전성
- Tone.js 로드 실패 시 콘솔 경고 후 무음 폴백 (`if(!window.Tone)` 가드)
- AudioContext 시작 실패 try/catch
- buildPiano 재호출 시 기존 폴리신스 dispose
- 일시정지 중 setState 폭주 방지 (이른 return)
- 데모 모드 키 프레스 자동 해제 (setTimeout 180ms)

#### ✅ UI/UX 검증
- Galaxy Flip(세로 긴 화면) 대응: clamp() 폰트, 100dvh, safe-area-inset
- 모바일 터치: onPointerDown/Up/Cancel/Leave 4종 모두 처리
- 핀치 줌 (두 손가락) 유지
- 스크롤바 숨김 유지
- 다크모드 유지 (배경 #08080e)
- 카드 전체 클릭 가능하도록 onClick을 outer div로 이동
- 데모 ▶ 버튼은 stopPropagation 으로 이벤트 격리

#### ✅ 접근성
- 주요 아이콘 버튼에 `aria-label` 추가 (뒤로/설정/확대/축소/일시정지 등)
- 키보드 네비게이션 가능 (Space, Esc)
- 색 대비: 텍스트 #bbb 이상, 강조 #00f5d4

### Phase 4. 마무리
- 커밋 메시지 상세 작성
- AUTO_REPORT.md 생성
- git commit + push

### 남은 개선점 (다음 회차)
- 실제 피아노 샘플 (Tone.Sampler) 적용 — CDN 외부 오디오 파일 필요
- 연습 모드 (틀린 노트에서 자동 정지)
- 양손 분리 연습 (좌/우 트랙)
- 곡 진행 저장 / 최고 점수 기록 (localStorage)
- MIDI 파일 임포트
- 멀티플레이어 (WebRTC)
- 더 많은 K-Pop / 애니 OST
