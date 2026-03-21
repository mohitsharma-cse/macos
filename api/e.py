from openai import OpenAI

client = OpenAI(api_key="sk-svcacct-CMaeBCQHRQFZEPpkosPPuI34_R2rtgG1L6nuqsy_klx4a0iqrAg7vgo3y-5MxRLWfrAGZ1ADSOxT3BlbkFJRtJfiteqlUFWoLLVxyZEftL3RKGrYn5k7sHLf5GUFiDZC-CgyjbGO8TIBL7gQ3l5rzu2Cej0engA")

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say hello"}]
)

print(response.choices[0].message.content)