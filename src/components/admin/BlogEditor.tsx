// Re-triggering build with fresh v2 imports
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    Type
} from 'lucide-react';

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

export function BlogEditor({ content, onChange, onImageUpload }: BlogEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder: 'Tell your story...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px]',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files && input.files[0] && onImageUpload) {
                const file = input.files[0];
                const url = await onImageUpload(file);
                editor.chain().focus().setImage({ src: url }).run();
            }
        };
        input.click();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="relative">
            {/* Floating Menu for new lines */}
            <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-1 bg-white border border-neutral-200 shadow-sm p-1 rounded-md">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-neutral-100' : ''}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-neutral-100' : ''}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-neutral-100' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={addImage}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </FloatingMenu>

            {/* Bubble Menu for selection */}
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="flex gap-1 bg-neutral-900 border border-neutral-800 shadow-xl p-1 rounded-md mb-2">
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('bold') ? 'bg-neutral-700' : ''}`}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('italic') ? 'bg-neutral-700' : ''}`}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('underline') ? 'bg-neutral-700' : ''}`}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <div className="w-[1px] bg-neutral-700 mx-1 self-stretch" />
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-700' : ''}`}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('blockquote') ? 'bg-neutral-700' : ''}`}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={setLink}
                    className={`text-white hover:bg-neutral-700 hover:text-white ${editor.isActive('link') ? 'bg-neutral-700' : ''}`}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </BubbleMenu>

            <div className="bg-white rounded-lg">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
