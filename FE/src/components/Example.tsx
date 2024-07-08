import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import EmailForm from './EmailForm'

export default function Example() {
    return (
        <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 bg-pink-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-xl lg:max-w-lg">
                    <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Hello world.</h2>
                    <p className="mt-4 text-lg leading-8 text-gray-3000">
                        Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing velit quis. Duis tempor incididunt
                        dolore.
                    </p>
                    <div className="mt-6 max-w-md gap-x-4">
                        <EmailForm />
                    </div>
                </div>
            </div>
            <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>
        </div>
    )
}
