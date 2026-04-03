const API_KEY = "AIzaSyBgn2uGMqgeZVvaf-5zx1Cxy7pqsbflwTM"; 

window.generatePlan = async function() {
    const input = document.getElementById('youtubeInput').value;
    const btn = document.getElementById('btn');
    const resultSection = document.getElementById('resultSection');
    const resultContainer = document.getElementById('resultContainer');

    if (!input) {
        alert("내용을 입력해주세요!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ ChatGPT가 기획안을 작성 중입니다...";
    resultSection.classList.remove('hidden');
    resultContainer.innerHTML = "<p class='text-center p-10 text-green-600 font-bold animate-pulse text-lg'>GPT-4o 모델에 연결 중입니다. 잠시만 기다려주세요!</p>";

    try {
        // OpenAI 표준 API 호출 주소입니다.
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // 가장 빠르고 저렴한 최신 모델입니다.
                messages: [
                    { role: "system", content: "당신은 역량 있는 교육 커리큘럼 설계자입니다." },
                    { role: "user", content: input + " 이 내용을 바탕으로 교육 커리큘럼 3가지를 제안해줘. 한국어로 작성해줘." }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.choices && data.choices[0].message) {
            const text = data.choices[0].message.content;
            resultContainer.innerHTML = `
                <div class="bg-white border-2 border-green-50 p-8 rounded-2xl shadow-inner whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                    ${text}
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        alert("🚨 에러: " + error.message);
        resultContainer.innerHTML = `<p class='text-red-500 p-4 font-bold text-center'>오류 발생: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "🚀 강의 기획안 생성하기";
    }
};
