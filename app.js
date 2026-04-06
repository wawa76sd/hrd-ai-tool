const API_KEY = "AIzaSyD7CxqUWluW-gSlEBGBfsvdARQ9UnPeb98"; 

window.generatePlan = async function() {
    const input = document.getElementById('youtubeInput').value;
    const btn = document.getElementById('btn');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!input) {
        alert("분석할 정보를 입력해 주세요!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ 분석 중...";
    resultSection.classList.remove('hidden');

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `당신은 해커스 교육그룹의 강의 기획 교수설계자입니다. 
다음 정보를 분석하여 반드시 아래의 [출력 양식]에 맞춰서만 답변하세요.

[분석 정보]: ${input}

[출력 양식]:
■ 강의 대주제:
■ 강의 분야:
■ 제작 내용:
- 강의 세부 내용 1:
- 강의 세부 내용 2:
- 강의 세부 내용 3:`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("응답 구조가 예상과 다릅니다.");
        }

        resultContainer.innerHTML = `
            <div class="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-sm whitespace-pre-wrap">
                ${text}
            </div>
        `;

    } catch (error) {
        console.error(error);
        alert("🚨 에러: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
