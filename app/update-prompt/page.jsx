"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Form from '@components/Form'

const EditPrompt = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const promptId = searchParams.get('id')

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    })

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json()
            setPost({
                prompt: data.prompt,
                tag: data.tag,
            })
        }
        if (promptId) {
            getPromptDetails()
        }
    }, [promptId])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!promptId) {
            alert('Prompt ID not found')
            setSubmitting(false);
            return;
        }
        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                router.push('/')
            }   
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
    )
}

const EditPromptWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <EditPrompt />
    </Suspense>
);

export default EditPromptWrapper;
