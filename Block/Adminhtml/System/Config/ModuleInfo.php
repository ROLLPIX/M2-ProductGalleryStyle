<?php
/**
 * Rollpix ProductGallery - Module Info Block
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Block\Adminhtml\System\Config;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;
use Magento\Backend\Block\Template\Context;
use Magento\Framework\Component\ComponentRegistrarInterface;
use Magento\Framework\Filesystem\Directory\ReadFactory;

class ModuleInfo extends Field
{
    private ComponentRegistrarInterface $componentRegistrar;
    private ReadFactory $readFactory;

    public function __construct(
        Context $context,
        ComponentRegistrarInterface $componentRegistrar,
        ReadFactory $readFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->componentRegistrar = $componentRegistrar;
        $this->readFactory = $readFactory;
    }

    protected function _getElementHtml(AbstractElement $element): string
    {
        $version = $this->getModuleVersion();
        $repoUrl = 'https://github.com/ROLLPIX/M2-ProductGalleryStyle';

        return '<div style="padding: 10px 0;">'
            . '<strong style="font-size: 14px;">ROLLPIX - Product Gallery</strong><br/>'
            . '<a href="' . $repoUrl . '" target="_blank" style="color: #1979c3;">' . $repoUrl . '</a><br/>'
            . '<span style="color: #666;">v' . $this->escapeHtml($version) . '</span>'
            . '</div>';
    }

    private function getModuleVersion(): string
    {
        try {
            $path = $this->componentRegistrar->getPath(
                ComponentRegistrarInterface::MODULE,
                'Rollpix_ProductGallery'
            );

            $directoryRead = $this->readFactory->create($path);
            $composerJson = $directoryRead->readFile('composer.json');
            $data = json_decode($composerJson, true);

            return $data['version'] ?? 'unknown';
        } catch (\Exception $e) {
            return 'unknown';
        }
    }
}
