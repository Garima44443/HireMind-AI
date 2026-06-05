from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(
    jd_text,
    resume_text
):

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform(
        [jd_text, resume_text]
    )

    similarity = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]

    return round(
        float(similarity * 100),
        2
    )